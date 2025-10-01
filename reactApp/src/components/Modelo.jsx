// ModelViewerWrapper.jsx
import React, { useRef, useEffect, useMemo, Suspense } from "react";
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

/* ===== Componente Label ===== */
const Label = ({ color = "white", valueColor = "green", tag, value, position, unit = "%" }) => (
  <group>
    <Text
      color={color}
      fontSize={0.4}
      fontWeight="bold"
      position={position}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="rgba(0,0,0,0.8)"
      material-toneMapped={false}
      rotation={[0.5, 0, 0]}
    >
      {tag}
    </Text>
    <Text
      color={valueColor}
      fontSize={0.4}
      fontWeight="bold"
      position={[position[0], position[1] - 0.6, position[2]]}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="rgba(0,0,0,0.8)"
      material-toneMapped={false}
      rotation={[0.5, 0, 0]}
    >
      {`${value.toFixed(2)} ${unit}`}
    </Text>
  </group>
);

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

  /* --- Labels com useMemo --- */
  const receitas = useMemo(
    () => ({
      receitaA: { tag: socketTagA || "A", value: ensureNumber(socketReceitaA) },
      receitaB: { tag: socketTagB || "B", value: ensureNumber(socketReceitaB) },
      receitaC: { tag: socketTagC || "C", value: ensureNumber(socketReceitaC) },
      receitaD: { tag: socketTagD || "D", value: ensureNumber(socketReceitaD) },
      balancaA: { tag: socketTagBalanca || "Balança", value: ensureNumber(socketReceitaBalancaA) },
      mixer: { tag: socketTagMisturador || "Misturador", value: ensureNumber(socketReceitaMisturador) },
    }),
    [
      socketTagA, socketReceitaA,
      socketTagB, socketReceitaB,
      socketTagC, socketReceitaC,
      socketTagD, socketReceitaD,
      socketTagBalanca, socketReceitaBalancaA,
      socketTagMisturador, socketReceitaMisturador,
    ]
  );

  /* --- Setup único de câmera e shaders --- */
  const setupDone = useRef(false);
  useEffect(() => {
    if (setupDone.current) return;
    if (!materials || !cameras) return;

    // Configuração de câmera
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
        shader.vertexShader = `varying vec3 vWorldPosition;\n${shader.vertexShader}`.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>\nvec4 worldPosition = modelMatrix * vec4(position, 1.0);\nvWorldPosition = worldPosition.xyz;`
        );
        shader.fragmentShader = `uniform float fillLevel;\nuniform vec3 fillColor;\nuniform float mixFactor;\nuniform float time;\nuniform float activateBlink;\nvarying vec3 vWorldPosition;\n${shader.fragmentShader}`.replace(
          "#include <dithering_fragment>",
          `#include <dithering_fragment>\nif(vWorldPosition.y < fillLevel){gl_FragColor.rgb = mix(gl_FragColor.rgb, fillColor, mixFactor);} if(activateBlink > 0.5){float blink = abs(sin(time * 5.0)); gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0,0.0,0.0), blink);}`
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
        shader.vertexShader = `varying vec3 vWorldPosition;\n${shader.vertexShader}`.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>\nvec4 worldPosition = modelMatrix * vec4(position, 1.0);\nvWorldPosition = worldPosition.xyz;`
        );
        shader.fragmentShader = `uniform float fillLevel;\nuniform vec3 fillColor;\nuniform float mixFactor;\nvarying vec3 vWorldPosition;\n${shader.fragmentShader}`.replace(
          "#include <dithering_fragment>",
          `#include <dithering_fragment>\nif(vWorldPosition.y < fillLevel){gl_FragColor.rgb = mix(gl_FragColor.rgb, fillColor, mixFactor);}`
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
        shader.fragmentShader = `uniform float time;\nuniform float activateBlink;\n${shader.fragmentShader}`.replace(
          "#include <dithering_fragment>",
          `#include <dithering_fragment>\nif(activateBlink > 0.5){float blink = abs(sin(time * 5.0)); gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(${blinkColor.join(",")}), blink);}`
        );
        mat.userData.shader = shader;
      };
      mat.needsUpdate = true;
    };

    // Aplicação
    setFunnelShader(materials.FunilA);
    setFunnelShader(materials.FunilB);
    setFunnelShader(materials.FunilC);
    setFunnelShader(materials.FunilD);

    setSimpleFillShader(materials.BalacaA, colorBatch);
    setSimpleFillShader(materials.Misturador, colorMisturador);

    setBlinkShader(materials.SensorA, [1, 0, 0]);
    setBlinkShader(materials.SensorB, [1, 0, 0]);
    setBlinkShader(materials.SensorC, [1, 0, 0]);
    setBlinkShader(materials.SensorD, [1, 0, 0]);

    setBlinkShader(materials.VacuoA, [0, 1, 0]);
    setBlinkShader(materials.VacuoB, [0, 1, 0]);
    setBlinkShader(materials.VacuoC, [0, 1, 0]);
    setBlinkShader(materials.VacuoD, [0, 1, 0]);

    setupDone.current = true;

    // cleanup -> evita leaks de GPU
    return () => {
      Object.values(materials).forEach((m) => m?.dispose && m.dispose());
    };
  }, [materials, cameras, gl, set, modelParams.mixFactor, modelParams.camera, colorFunil, colorBatch, colorMisturador]);

  /* --- Função genérica de update --- */
  const updateShader = (mat, { fillValue, delta, blink }) => {
    if (!mat?.userData.shader) return;
    const sh = mat.userData.shader;
    if (fillValue !== undefined) sh.uniforms.fillLevel.value = fillValue;
    if (delta) sh.uniforms.time.value += delta;
    if (blink !== undefined) sh.uniforms.activateBlink.value = blink ? 1.0 : 0.0;
  };

  /* --- Atualizações por frame --- */
  useFrame((_, delta) => {
    updateShader(materials.FunilA, {
      fillValue: getNormalizedFillLevel(socketValueFunilA, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel),
      delta,
      blink: socketFaltaMaterialA,
    });
    updateShader(materials.FunilB, {
      fillValue: getNormalizedFillLevel(socketValueFunilB, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel),
      delta,
      blink: socketFaltaMaterialB,
    });
    updateShader(materials.FunilC, {
      fillValue: getNormalizedFillLevel(socketValueFunilC, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel),
      delta,
      blink: socketFaltaMaterialC,
    });
    updateShader(materials.FunilD, {
      fillValue: getNormalizedFillLevel(socketValueFunilD, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel),
      delta,
      blink: socketFaltaMaterialD,
    });

    updateShader(materials.BalacaA, {
      fillValue: getNormalizedFillLevel(socketValueBalacaA, maxValueBalacaA, modelParams.initialFillLevel, modelParams.maxFillLevel),
    });
    updateShader(materials.Misturador, {
      fillValue: getNormalizedFillLevel(socketValueMisturador, maxValueMisturador, modelParams.initialFillLevel, modelParams.maxFillLevel),
    });

    updateShader(materials.SensorA, { delta, blink: socketSensorA });
    updateShader(materials.SensorB, { delta, blink: socketSensorB });
    updateShader(materials.SensorC, { delta, blink: socketSensorC });
    updateShader(materials.SensorD, { delta, blink: socketSensorD });

    updateShader(materials.VacuoA, { delta, blink: socketVacuoA });
    updateShader(materials.VacuoB, { delta, blink: socketVacuoB });
    updateShader(materials.VacuoC, { delta, blink: socketVacuoC });
    updateShader(materials.VacuoD, { delta, blink: socketVacuoD });
  });

  /* --- Transform do modelo --- */
  scene.position.set(...modelParams.position);
  scene.rotation.set(...modelParams.rotation);
  scene.scale.set(...modelParams.scale);

  /* --- Posições das labels --- */
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
      {materials.FunilA && <Label {...receitas.receitaA} position={labelPositions.receitaA} unit="%" />}
      {materials.FunilB && <Label {...receitas.receitaB} position={labelPositions.receitaB} unit="%" />}
      {materials.FunilC && <Label {...receitas.receitaC} position={labelPositions.receitaC} unit="%" />}
      {materials.FunilD && <Label {...receitas.receitaD} position={labelPositions.receitaD} unit="%" />}
      {materials.BalacaA && <Label {...receitas.balancaA} position={labelPositions.balancaA} unit="Kg" />}
      {materials.Misturador && <Label {...receitas.mixer} position={labelPositions.mixer} unit="Kg" />}
    </group>
  );
};

/* ===== Viewer ===== */
const ModelViewer = ({ modelPath, modelParams, ...otherProps }) => (
  <Canvas
    camera={{
      position: modelParams.camera.position,
      fov: modelParams.camera.fov,
      near: modelParams.camera.near,
      far: modelParams.camera.far,
    }}
    frameloop="always"
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

/* ===== Wrapper ===== */
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
