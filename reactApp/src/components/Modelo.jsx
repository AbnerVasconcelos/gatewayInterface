// ModelViewerWrapper.jsx
import React, { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Text } from "@react-three/drei";
import { Color } from "three";

/* ===== Helpers ===== */
const ensureNumber = (value, def = 0) => {
  if (value === null || value === undefined) return def;
  const n = Number(value);
  return Number.isNaN(n) ? def : n;
};

const getNormalizedFillLevel = (socketValue, maxValue, initialFill, maxFill) => {
  if (typeof socketValue === "number" && typeof maxValue === "number" && maxValue > 0) {
    return (socketValue / maxValue) * maxFill;
  }
  return initialFill;
};

/* ===== Model ===== */
const Model = ({
  path,
  modelParams,
  maxValueFunil,
  colorFunil,
  maxValueBalacaA,
  colorBatch,
  maxValueMisturador,
  colorMisturador,
  socketValueFunilA,
  socketValueFunilB,
  socketValueFunilC,
  socketValueFunilD,
  socketValueBalacaA,
  socketValueMisturador,
  socketFaltaMaterialA,
  socketFaltaMaterialB,
  socketFaltaMaterialC,
  socketFaltaMaterialD,
  socketReceitaA,
  socketReceitaB,
  socketReceitaC,
  socketReceitaD,
  socketTagA,
  socketTagB,
  socketTagC,
  socketTagD,
  socketSensorA,
  socketSensorB,
  socketSensorC,
  socketSensorD,
  socketVacuoA,
  socketVacuoB,
  socketVacuoC,
  socketVacuoD,
  socketReceitaBalancaA,
  socketTagBalanca,
  socketReceitaMisturador,
  socketTagMisturador,
}) => {
  const { scene, materials, cameras } = useGLTF(path);
  const { gl, set } = useThree();

  /* --- Labels (receitas) --- */
  const [receitas, setReceitas] = useState({
    receitaA: { tag: socketTagA || "A", value: ensureNumber(socketReceitaA) },
    receitaB: { tag: socketTagB || "B", value: ensureNumber(socketReceitaB) },
    receitaC: { tag: socketTagC || "C", value: ensureNumber(socketReceitaC) },
    receitaD: { tag: socketTagD || "D", value: ensureNumber(socketReceitaD) },
    balancaA: { tag: socketTagBalanca || "Balança", value: ensureNumber(socketReceitaBalancaA) },
    mixer: { tag: socketTagMisturador || "Misturador", value: ensureNumber(socketReceitaMisturador) },
  });

  useEffect(() => {
    const next = {
      receitaA: { tag: socketTagA || "A", value: ensureNumber(socketReceitaA) },
      receitaB: { tag: socketTagB || "B", value: ensureNumber(socketReceitaB) },
      receitaC: { tag: socketTagC || "C", value: ensureNumber(socketReceitaC) },
      receitaD: { tag: socketTagD || "D", value: ensureNumber(socketReceitaD) },
      balancaA: { tag: socketTagBalanca || "Balança", value: ensureNumber(socketReceitaBalancaA) },
      mixer: { tag: socketTagMisturador || "Misturador", value: ensureNumber(socketReceitaMisturador) },
    };
    setReceitas((prev) => {
      const same = Object.keys(next).every(
        (k) => prev[k]?.tag === next[k].tag && prev[k]?.value === next[k].value
      );
      return same ? prev : next;
    });
  }, [
    socketTagA, socketReceitaA,
    socketTagB, socketReceitaB,
    socketTagC, socketReceitaC,
    socketTagD, socketReceitaD,
    socketTagBalanca, socketReceitaBalancaA,
    socketTagMisturador, socketReceitaMisturador,
  ]);

  /* --- Setup único de câmera e shaders --- */
  const setupDone = useRef(false);
  useEffect(() => {
    if (setupDone.current) return;
    if (!materials || !cameras) return;

    // Câmera: aplica 1x
    if (cameras.length > 0 && modelParams?.camera) {
      const gltfCamera = cameras[0];
      const { position, rotation, fov, near, far } = modelParams.camera;
      if (position) gltfCamera.position.set(...position);
      if (rotation) gltfCamera.rotation.set(...rotation);
      if (fov) gltfCamera.fov = fov;
      if (near) gltfCamera.near = near;
      if (far) gltfCamera.far = far;
      gltfCamera.updateProjectionMatrix();
      set({ camera: gltfCamera });
      gl.setDefaultCamera(gltfCamera);
    }

    const setFunnelShader = (mat) => {
      if (!mat) return;
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.fillLevel = { value: 0 };
        shader.uniforms.fillColor = { value: new Color(colorFunil) };
        shader.uniforms.mixFactor = { value: modelParams.mixFactor };
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: 0 };

        shader.vertexShader = `varying vec3 vWorldPosition;
${shader.vertexShader}`.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           vec4 worldPosition = modelMatrix * vec4(position, 1.0);
           vWorldPosition = worldPosition.xyz;`
        );

        shader.fragmentShader = `uniform float fillLevel;
uniform vec3 fillColor;
uniform float mixFactor;
uniform float time;
uniform float activateBlink;
varying vec3 vWorldPosition;
${shader.fragmentShader}`.replace(
          "#include <dithering_fragment>",
          `#include <dithering_fragment>
           if(vWorldPosition.y < fillLevel) {
             gl_FragColor.rgb = mix(gl_FragColor.rgb, fillColor, mixFactor);
           }
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.0, 0.0), blink);
           }`
        );
        mat.userData.shader = shader;
      };
      mat.needsUpdate = true;
    };

    const setSimpleFillShader = (mat, colorHex) => {
      if (!mat) return;
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.fillLevel = { value: 0 };
        shader.uniforms.fillColor = { value: new Color(colorHex) };
        shader.uniforms.mixFactor = { value: modelParams.mixFactor };

        shader.vertexShader = `varying vec3 vWorldPosition;
${shader.vertexShader}`.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           vec4 worldPosition = modelMatrix * vec4(position, 1.0);
           vWorldPosition = worldPosition.xyz;`
        );

        shader.fragmentShader = `uniform float fillLevel;
uniform vec3 fillColor;
uniform float mixFactor;
varying vec3 vWorldPosition;
${shader.fragmentShader}`.replace(
          "#include <dithering_fragment>",
          `#include <dithering_fragment>
           if(vWorldPosition.y < fillLevel) {
             gl_FragColor.rgb = mix(gl_FragColor.rgb, fillColor, mixFactor);
           }`
        );
        mat.userData.shader = shader;
      };
      mat.needsUpdate = true;
    };

    const setBlinkShader = (mat, blinkColor = [1, 0, 0]) => {
      if (!mat) return;
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: 0 };
        shader.fragmentShader = `uniform float time;
uniform float activateBlink;
${shader.fragmentShader}`.replace(
          "#include <dithering_fragment>",
          `#include <dithering_fragment>
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(${blinkColor[0]}, ${blinkColor[1]}, ${blinkColor[2]}), blink);
           }`
        );
        mat.userData.shader = shader;
      };
      mat.needsUpdate = true;
    };

    // Funis
    setFunnelShader(materials.FunilA);
    setFunnelShader(materials.FunilB);
    setFunnelShader(materials.FunilC);
    setFunnelShader(materials.FunilD);

    // Balança / Misturador
    setSimpleFillShader(materials.BalacaA, colorBatch);
    setSimpleFillShader(materials.Misturador, colorMisturador);

    // Sensores (blink vermelho)
    setBlinkShader(materials.SensorA, [1, 0, 0]);
    setBlinkShader(materials.SensorB, [1, 0, 0]);
    setBlinkShader(materials.SensorC, [1, 0, 0]);
    setBlinkShader(materials.SensorD, [1, 0, 0]);

    // Vácuos (blink verde)
    setBlinkShader(materials.VacuoA, [0, 1, 0]);
    setBlinkShader(materials.VacuoB, [0, 1, 0]);
    setBlinkShader(materials.VacuoC, [0, 1, 0]);
    setBlinkShader(materials.VacuoD, [0, 1, 0]);

    setupDone.current = true;
  }, [materials, cameras, gl, set, modelParams.mixFactor, modelParams.camera, colorFunil, colorBatch, colorMisturador]);

  /* --- Atualizações por frame --- */
  useFrame((_, delta) => {
    // Funis
    if (materials.FunilA?.userData.shader) {
      const sh = materials.FunilA.userData.shader;
      sh.uniforms.fillLevel.value = getNormalizedFillLevel(
        socketValueFunilA, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel
      );
      sh.uniforms.time.value += delta;
      sh.uniforms.activateBlink.value = socketFaltaMaterialA ? 1.0 : 0.0;
    }
    if (materials.FunilB?.userData.shader) {
      const sh = materials.FunilB.userData.shader;
      sh.uniforms.fillLevel.value = getNormalizedFillLevel(
        socketValueFunilB, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel
      );
      sh.uniforms.time.value += delta;
      sh.uniforms.activateBlink.value = socketFaltaMaterialB ? 1.0 : 0.0;
    }
    if (materials.FunilC?.userData.shader) {
      const sh = materials.FunilC.userData.shader;
      sh.uniforms.fillLevel.value = getNormalizedFillLevel(
        socketValueFunilC, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel
      );
      sh.uniforms.time.value += delta;
      sh.uniforms.activateBlink.value = socketFaltaMaterialC ? 1.0 : 0.0;
    }
    if (materials.FunilD?.userData.shader) {
      const sh = materials.FunilD.userData.shader;
      sh.uniforms.fillLevel.value = getNormalizedFillLevel(
        socketValueFunilD, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel
      );
      sh.uniforms.time.value += delta;
      sh.uniforms.activateBlink.value = socketFaltaMaterialD ? 1.0 : 0.0;
    }

    // Balança / Misturador
    if (materials.BalacaA?.userData.shader) {
      const sh = materials.BalacaA.userData.shader;
      sh.uniforms.fillLevel.value = getNormalizedFillLevel(
        socketValueBalacaA, maxValueBalacaA, modelParams.initialFillLevel, modelParams.maxFillLevel
      );
    }
    if (materials.Misturador?.userData.shader) {
      const sh = materials.Misturador.userData.shader;
      sh.uniforms.fillLevel.value = getNormalizedFillLevel(
        socketValueMisturador, maxValueMisturador, modelParams.initialFillLevel, modelParams.maxFillLevel
      );
    }

    // Sensores
    if (materials.SensorA?.userData.shader) {
      const sh = materials.SensorA.userData.shader;
      sh.uniforms.time.value += delta;
      sh.uniforms.activateBlink.value = socketSensorA ? 1.0 : 0.0;
    }
    if (materials.SensorB?.userData.shader) {
      const sh = materials.SensorB.userData.shader;
      sh.uniforms.time.value += delta;
      sh.uniforms.activateBlink.value = socketSensorB ? 1.0 : 0.0;
    }
    if (materials.SensorC?.userData.shader) {
      const sh = materials.SensorC.userData.shader;
      sh.uniforms.time.value += delta;
      sh.uniforms.activateBlink.value = socketSensorC ? 1.0 : 0.0;
    }
    if (materials.SensorD?.userData.shader) {
      const sh = materials.SensorD.userData.shader;
      sh.uniforms.time.value += delta;
      sh.uniforms.activateBlink.value = socketSensorD ? 1.0 : 0.0;
    }

    // Vácuos
    if (materials.VacuoA?.userData.shader) {
      const sh = materials.VacuoA.userData.shader;
      sh.uniforms.time.value += delta;
      sh.uniforms.activateBlink.value = socketVacuoA ? 1.0 : 0.0;
    }
    if (materials.VacuoB?.userData.shader) {
      const sh = materials.VacuoB.userData.shader;
      sh.uniforms.time.value += delta;
      sh.uniforms.activateBlink.value = socketVacuoB ? 1.0 : 0.0;
    }
    if (materials.VacuoC?.userData.shader) {
      const sh = materials.VacuoC.userData.shader;
      sh.uniforms.time.value += delta;
      sh.uniforms.activateBlink.value = socketVacuoC ? 1.0 : 0.0;
    }
    if (materials.VacuoD?.userData.shader) {
      const sh = materials.VacuoD.userData.shader;
      sh.uniforms.time.value += delta;
      sh.uniforms.activateBlink.value = socketVacuoD ? 1.0 : 0.0;
    }
  });

  /* --- Transform do modelo --- */
  scene.position.set(...modelParams.position);
  scene.rotation.set(...modelParams.rotation);
  scene.scale.set(...modelParams.scale);

  /* --- Posições das labels (sem duplicatas) --- */
  const labelPositions = {
    receitaA: [-1, 3.2, 2],
    receitaB: [1.1, 3.2, 2],
    receitaC: [-3.3, 4, 2],
    receitaD: [3.5, 4, 2],
    balancaA: [2.9, -1.1, -1.5],
    mixer: [2.9, -3, -2],
  };

  return (
    <group>
      <primitive object={scene} />
      {materials.FunilA && (
        <group>
          <Text color="white" fontSize={0.4} fontWeight="bold"
            position={labelPositions.receitaA} anchorX="center" anchorY="middle"
            outlineWidth={0.02} outlineColor="rgba(0,0,0,0.8)" material-toneMapped={false}
            rotation={[0.5, 0, 0]}>
            {receitas.receitaA.tag}
          </Text>
          <Text color="green" fontSize={0.4} fontWeight="bold"
            position={[labelPositions.receitaA[0], labelPositions.receitaA[1] - 0.6, labelPositions.receitaA[2]]}
            anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false} rotation={[0.5, 0, 0]}>
            {`${receitas.receitaA.value.toFixed(2)} %`}
          </Text>
        </group>
      )}

      {materials.FunilB && (
        <group>
          <Text color="white" fontSize={0.4} fontWeight="bold"
            position={labelPositions.receitaB} anchorX="center" anchorY="middle"
            outlineWidth={0.02} outlineColor="rgba(0,0,0,0.8)" material-toneMapped={false}
            rotation={[0.5, 0, 0]}>
            {receitas.receitaB.tag}
          </Text>
          <Text color="green" fontSize={0.4} fontWeight="bold"
            position={[labelPositions.receitaB[0], labelPositions.receitaB[1] - 0.6, labelPositions.receitaB[2]]}
            anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false} rotation={[0.5, 0, 0]}>
            {`${receitas.receitaB.value.toFixed(2)} %`}
          </Text>
        </group>
      )}

      {materials.FunilC && (
        <group>
          <Text color="white" fontSize={0.4} fontWeight="bold"
            position={labelPositions.receitaC} anchorX="center" anchorY="middle"
            outlineWidth={0.02} outlineColor="rgba(0,0,0,0.8)" material-toneMapped={false}
            rotation={[0.5, 0, 0]}>
            {receitas.receitaC.tag}
          </Text>
          <Text color="green" fontSize={0.4} fontWeight="bold"
            position={[labelPositions.receitaC[0], labelPositions.receitaC[1] - 0.6, labelPositions.receitaC[2]]}
            anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false} rotation={[0.5, 0, 0]}>
            {`${receitas.receitaC.value.toFixed(2)} %`}
          </Text>
        </group>
      )}

      {materials.FunilD && (
        <group>
          <Text color="white" fontSize={0.4} fontWeight="bold"
            position={labelPositions.receitaD} anchorX="center" anchorY="middle"
            outlineWidth={0.02} outlineColor="rgba(0,0,0,0.8)" material-toneMapped={false}
            rotation={[0.5, 0, 0]}>
            {receitas.receitaD.tag}
          </Text>
          <Text color="green" fontSize={0.4} fontWeight="bold"
            position={[labelPositions.receitaD[0], labelPositions.receitaD[1] - 0.6, labelPositions.receitaD[2]]}
            anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false} rotation={[0.5, 0, 0]}>
            {`${receitas.receitaD.value.toFixed(2)} %`}
          </Text>
        </group>
      )}

      {materials.BalacaA && (
        <group>
          <Text color="white" fontSize={0.4} fontWeight="bold"
            position={labelPositions.balancaA} anchorX="center" anchorY="middle"
            outlineWidth={0.02} outlineColor="rgba(0,0,0,0.8)" material-toneMapped={false}
            rotation={[0.5, 0, 0]}>
            {receitas.balancaA.tag}
          </Text>
          <Text color="green" fontSize={0.4} fontWeight="bold"
            position={[labelPositions.balancaA[0], labelPositions.balancaA[1] - 0.6, labelPositions.balancaA[2]]}
            anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false} rotation={[0.5, 0, 0]}>
            {`${receitas.balancaA.value.toFixed(2)} Kg`}
          </Text>
        </group>
      )}

      {materials.Misturador && (
        <group>
          <Text color="white" fontSize={0.4} fontWeight="bold"
            position={labelPositions.mixer} anchorX="center" anchorY="middle"
            outlineWidth={0.02} outlineColor="rgba(0,0,0,0.8)" material-toneMapped={false}
            rotation={[0.5, 0, 0]}>
            {receitas.mixer.tag}
          </Text>
          <Text color="green" fontSize={0.4} fontWeight="bold"
            position={[labelPositions.mixer[0], labelPositions.mixer[1] - 0.6, labelPositions.mixer[2]]}
            anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false} rotation={[0.5, 0, 0]}>
            {`${receitas.mixer.value.toFixed(2)} Kg`}
          </Text>
        </group>
      )}
    </group>
  );
};

/* ===== Viewer ===== */
const ModelViewer = ({ modelPath, modelParams, ...otherProps }) => {
  return (
    <Canvas
      camera={{
        position: modelParams.camera.position,
        fov: modelParams.camera.fov,
        near: modelParams.camera.near,
        far: modelParams.camera.far,
      }}
    >
      <ambientLight intensity={modelParams.ambientLightIntensity} />
      {modelParams.directionalLightPositions.map((pos, i) => (
        <directionalLight key={i} position={pos} intensity={modelParams.directionalLightIntensity} />
      ))}
      <hemisphereLight skyColor="white" groundColor="gray" intensity={modelParams.hemisphereLightIntensity} />
      <OrbitControls enableZoom={modelParams.enableZoom} />
      <Model path={modelPath} modelParams={modelParams} {...otherProps} />
    </Canvas>
  );
};

/* ===== Wrapper (memoiza params) ===== */
const ModelViewerWrapper = (props) => {
  const modelParams = useMemo(
    () => ({
      position: [0, -3.5, -3],
      rotation: [0.49, 2.93, 0],
      scale: [4.7, 4.7, 4.7],
      initialFillLevel: 0,
      fillSpeed: 0.1,
      maxFillLevel: 50,
      mixFactor: 0.2,
      ambientLightIntensity: 0.5,
      directionalLightIntensity: 0.4,
      directionalLightPositions: [
        [-2, -2, 2],
        [-2, 2, -2],
      ],
      hemisphereLightIntensity: 2,
      camera: {
        position: [0, -4, 10],
        rotation: [0, -0.19, 0],
        fov: 50,
        near: 0.7,
        far: 1500,
      },
      enableZoom: false,
    }),
    []
  );

  return (
    <Suspense fallback={<div>Carregando modelo 3D...</div>}>
      <ModelViewer modelParams={modelParams} {...props} />
    </Suspense>
  );
};

export default ModelViewerWrapper;
