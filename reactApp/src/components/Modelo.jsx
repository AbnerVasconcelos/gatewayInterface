import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Text } from '@react-three/drei';
import { Color } from 'three';
import { useTheme } from '@mui/material';
// Função auxiliar para calcular o nível normalizado
const getNormalizedFillLevel = (socketValue, maxValue, initialFillLevel, maxFillLevel) => {
  if (typeof socketValue === 'number' && typeof maxValue === 'number' && maxValue > 0) {
    return (socketValue / maxValue) * maxFillLevel;
  }
  return initialFillLevel;
};

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
  const theme =useTheme()

  // Estado para os rótulos (receitas) – cada um com tag e valor.
  const [receitas, setReceitas] = useState({
    receitaA: { tag: socketTagA || "A", value: socketReceitaA },
    receitaB: { tag: socketTagB || "B", value: socketReceitaB },
    receitaC: { tag: socketTagC || "C", value: socketReceitaC },
    receitaD: { tag: socketTagD || "D", value: socketReceitaD },
    balancaA: { tag: socketTagBalanca || "Balança", value: socketReceitaBalancaA },
    mixer: { tag: socketTagMisturador || "Misturador", value: socketReceitaMisturador },
  });

  // Atualiza os valores conforme os dados recebidos via socket.io
  useEffect(() => {
    setReceitas({
      receitaA: { tag: socketTagA || "A", value: socketReceitaA },
      receitaB: { tag: socketTagB || "B", value: socketReceitaB },
      receitaC: { tag: socketTagC || "C", value: socketReceitaC },
      receitaD: { tag: socketTagD || "D", value: socketReceitaD },
      balancaA: { tag: socketTagBalanca || "Balança", value: socketReceitaBalancaA },
      mixer: { tag: socketTagMisturador || "Misturador", value: socketReceitaMisturador },
    });
  }, [
    socketTagA,
    socketReceitaA,
    socketTagB,
    socketReceitaB,
    socketTagC,
    socketReceitaC,
    socketTagD,
    socketReceitaD,
    socketTagBalanca,
    socketReceitaBalancaA,
    socketTagMisturador,
    socketReceitaMisturador,
  ]);

  useEffect(() => {
    console.log('Materiais carregados:', materials);
    if (cameras && cameras.length > 0) {
      const gltfCamera = cameras[0];
      if (modelParams.camera) {
        const { position, rotation, fov, near, far } = modelParams.camera;
        if (position) gltfCamera.position.set(...position);
        if (rotation) gltfCamera.rotation.set(...rotation);
        if (fov) gltfCamera.fov = fov;
        if (near) gltfCamera.near = near;
        if (far) gltfCamera.far = far;
        gltfCamera.updateProjectionMatrix();
      }
      set({ camera: gltfCamera });
      gl.setDefaultCamera(gltfCamera);
    }

    // Configuração dos materiais dos funis – aplicando efeito blink se as flags socketFaltaMaterial* estiverem ativas.
    if (materials.FunilA) {
      materials.FunilA.onBeforeCompile = (shader) => {
        shader.uniforms.fillLevel = {
          value: getNormalizedFillLevel(socketValueFunilA, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel)
        };
        shader.uniforms.fillColor = { value: new Color(colorFunil) };
        shader.uniforms.mixFactor = { value: modelParams.mixFactor };
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: socketFaltaMaterialA ? 1.0 : 0.0 };

        shader.vertexShader = `varying vec3 vWorldPosition;
${shader.vertexShader}`.replace(
          '#include <begin_vertex>',
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
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(vWorldPosition.y < fillLevel) {
             gl_FragColor.rgb = mix(gl_FragColor.rgb, fillColor, mixFactor);
           }
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.0, 0.0), blink);
           }`
        );
        materials.FunilA.userData.shader = shader;
      };
      materials.FunilA.needsUpdate = true;
    }
    if (materials.FunilB) {
      materials.FunilB.onBeforeCompile = (shader) => {
        shader.uniforms.fillLevel = {
          value: getNormalizedFillLevel(socketValueFunilB, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel)
        };
        shader.uniforms.fillColor = { value: new Color(colorFunil) };
        shader.uniforms.mixFactor = { value: modelParams.mixFactor };
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: socketFaltaMaterialB ? 1.0 : 0.0 };

        shader.vertexShader = `varying vec3 vWorldPosition;
${shader.vertexShader}`.replace(
          '#include <begin_vertex>',
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
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(vWorldPosition.y < fillLevel) {
             gl_FragColor.rgb = mix(gl_FragColor.rgb, fillColor, mixFactor);
           }
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.0, 0.0), blink);
           }`
        );
        materials.FunilB.userData.shader = shader;
      };
      materials.FunilB.needsUpdate = true;
    }
    if (materials.FunilC) {
      materials.FunilC.onBeforeCompile = (shader) => {
        shader.uniforms.fillLevel = {
          value: getNormalizedFillLevel(socketValueFunilC, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel)
        };
        shader.uniforms.fillColor = { value: new Color(colorFunil) };
        shader.uniforms.mixFactor = { value: modelParams.mixFactor };
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: socketFaltaMaterialC ? 1.0 : 0.0 };

        shader.vertexShader = `varying vec3 vWorldPosition;
${shader.vertexShader}`.replace(
          '#include <begin_vertex>',
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
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(vWorldPosition.y < fillLevel) {
             gl_FragColor.rgb = mix(gl_FragColor.rgb, fillColor, mixFactor);
           }
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.0, 0.0), blink);
           }`
        );
        materials.FunilC.userData.shader = shader;
      };
      materials.FunilC.needsUpdate = true;
    }
    if (materials.FunilD) {
      materials.FunilD.onBeforeCompile = (shader) => {
        shader.uniforms.fillLevel = {
          value: getNormalizedFillLevel(socketValueFunilD, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel)
        };
        shader.uniforms.fillColor = { value: new Color(colorFunil) };
        shader.uniforms.mixFactor = { value: modelParams.mixFactor };
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: socketFaltaMaterialD ? 1.0 : 0.0 };

        shader.vertexShader = `varying vec3 vWorldPosition;
${shader.vertexShader}`.replace(
          '#include <begin_vertex>',
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
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(vWorldPosition.y < fillLevel) {
             gl_FragColor.rgb = mix(gl_FragColor.rgb, fillColor, mixFactor);
           }
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.0, 0.0), blink);
           }`
        );
        materials.FunilD.userData.shader = shader;
      };
      materials.FunilD.needsUpdate = true;
    }
    // Para BalacaA (renomeado para BalancaA) e Misturador, sem efeito blink
    if (materials.BalacaA) {
      materials.BalacaA.onBeforeCompile = (shader) => {
        shader.uniforms.fillLevel = {
          value: getNormalizedFillLevel(socketValueBalacaA, maxValueBalacaA, modelParams.initialFillLevel, modelParams.maxFillLevel)
        };
        shader.uniforms.fillColor = { value: new Color(colorBatch) };
        shader.uniforms.mixFactor = { value: modelParams.mixFactor };

        shader.vertexShader = `varying vec3 vWorldPosition;
${shader.vertexShader}`.replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           vec4 worldPosition = modelMatrix * vec4(position, 1.0);
           vWorldPosition = worldPosition.xyz;`
        );

        shader.fragmentShader = `uniform float fillLevel;
uniform vec3 fillColor;
uniform float mixFactor;
varying vec3 vWorldPosition;
${shader.fragmentShader}`.replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(vWorldPosition.y < fillLevel) {
             gl_FragColor.rgb = mix(gl_FragColor.rgb, fillColor, mixFactor);
           }`
        );
        materials.BalacaA.userData.shader = shader;
      };
      materials.BalacaA.needsUpdate = true;
    }
    if (materials.Misturador) {
      materials.Misturador.onBeforeCompile = (shader) => {
        shader.uniforms.fillLevel = {
          value: getNormalizedFillLevel(socketValueMisturador, maxValueMisturador, modelParams.initialFillLevel, modelParams.maxFillLevel)
        };
        shader.uniforms.fillColor = { value: new Color(colorMisturador) };
        shader.uniforms.mixFactor = { value: modelParams.mixFactor };

        shader.vertexShader = `varying vec3 vWorldPosition;
${shader.vertexShader}`.replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           vec4 worldPosition = modelMatrix * vec4(position, 1.0);
           vWorldPosition = worldPosition.xyz;`
        );

        shader.fragmentShader = `uniform float fillLevel;
uniform vec3 fillColor;
uniform float mixFactor;
varying vec3 vWorldPosition;
${shader.fragmentShader}`.replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(vWorldPosition.y < fillLevel) {
             gl_FragColor.rgb = mix(gl_FragColor.rgb, fillColor, mixFactor);
           }`
        );
        materials.Misturador.userData.shader = shader;
      };
      materials.Misturador.needsUpdate = true;
    }
    // Para os sensores e unidades de vácuo – aplicamos o efeito de blink conforme as flags
    if (materials.SensorA) {
      materials.SensorA.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: socketSensorA ? 1.0 : 0.0 };
        shader.fragmentShader = `uniform float time;
uniform float activateBlink;
${shader.fragmentShader}`.replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.0, 0.0), blink);
           }`
        );
        materials.SensorA.userData.shader = shader;
      };
      materials.SensorA.needsUpdate = true;
    }
    if (materials.SensorB) {
      materials.SensorB.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: socketSensorB ? 1.0 : 0.0 };
        shader.fragmentShader = `uniform float time;
uniform float activateBlink;
${shader.fragmentShader}`.replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.0, 0.0), blink);
           }`
        );
        materials.SensorB.userData.shader = shader;
      };
      materials.SensorB.needsUpdate = true;
    }
    if (materials.SensorC) {
      materials.SensorC.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: socketSensorC ? 1.0 : 0.0 };
        shader.fragmentShader = `uniform float time;
uniform float activateBlink;
${shader.fragmentShader}`.replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.0, 0.0), blink);
           }`
        );
        materials.SensorC.userData.shader = shader;
      };
      materials.SensorC.needsUpdate = true;
    }
    if (materials.SensorD) {
      materials.SensorD.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: socketSensorD ? 1.0 : 0.0 };
        shader.fragmentShader = `uniform float time;
uniform float activateBlink;
${shader.fragmentShader}`.replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.0, 0.0), blink);
           }`
        );
        materials.SensorD.userData.shader = shader;
      };
      materials.SensorD.needsUpdate = true;
    }
    if (materials.VacuoA) {
      materials.VacuoA.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: socketVacuoA ? 1.0 : 0.0 };
        shader.fragmentShader = `uniform float time;
uniform float activateBlink;
${shader.fragmentShader}`.replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0, 1.0, 0.0), blink);
           }`
        );
        materials.VacuoA.userData.shader = shader;
      };
      materials.VacuoA.needsUpdate = true;
    }
    if (materials.VacuoB) {
      materials.VacuoB.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: socketVacuoB ? 1.0 : 0.0 };
        shader.fragmentShader = `uniform float time;
uniform float activateBlink;
${shader.fragmentShader}`.replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0, 1.0, 0.0), blink);
           }`
        );
        materials.VacuoB.userData.shader = shader;
      };
      materials.VacuoB.needsUpdate = true;
    }
    if (materials.VacuoC) {
      materials.VacuoC.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: socketVacuoC ? 1.0 : 0.0 };
        shader.fragmentShader = `uniform float time;
uniform float activateBlink;
${shader.fragmentShader}`.replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0, 1.0, 0.0), blink);
           }`
        );
        materials.VacuoC.userData.shader = shader;
      };
      materials.VacuoC.needsUpdate = true;
    }
    if (materials.VacuoD) {
      materials.VacuoD.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.activateBlink = { value: socketVacuoD ? 1.0 : 0.0 };
        shader.fragmentShader = `uniform float time;
uniform float activateBlink;
${shader.fragmentShader}`.replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
           if(activateBlink > 0.5) {
             float blink = abs(sin(time * 5.0));
             gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0, 1.0, 0.0), blink);
           }`
        );
        materials.VacuoD.userData.shader = shader;
      };
      materials.VacuoD.needsUpdate = true;
    }
  }, [
    materials,
    cameras,
    gl,
    set,
    modelParams,
    socketValueFunilA,
    colorFunil,
    socketValueFunilB,
    socketValueFunilC,
    socketValueFunilD,
    socketValueBalacaA,
    colorBatch,
    socketValueMisturador,
    colorMisturador,
    socketFaltaMaterialA,
    socketFaltaMaterialB,
    socketFaltaMaterialC,
    socketFaltaMaterialD,
    socketVacuoA,
    socketVacuoB,
    socketVacuoC,
    socketVacuoD,
  ]);

  useFrame((state, delta) => {
    // Atualiza os valores dos funis, incluindo o tempo e a flag de blink
    if (materials.FunilA && materials.FunilA.userData.shader) {
      materials.FunilA.userData.shader.uniforms.fillLevel.value =
        getNormalizedFillLevel(socketValueFunilA, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel);
      materials.FunilA.userData.shader.uniforms.time.value += delta;
      materials.FunilA.userData.shader.uniforms.activateBlink.value = socketFaltaMaterialA ? 1.0 : 0.0;
    }
    if (materials.FunilB && materials.FunilB.userData.shader) {
      materials.FunilB.userData.shader.uniforms.fillLevel.value =
        getNormalizedFillLevel(socketValueFunilB, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel);
      materials.FunilB.userData.shader.uniforms.time.value += delta;
      materials.FunilB.userData.shader.uniforms.activateBlink.value = socketFaltaMaterialB ? 1.0 : 0.0;
    }
    if (materials.FunilC && materials.FunilC.userData.shader) {
      materials.FunilC.userData.shader.uniforms.fillLevel.value =
        getNormalizedFillLevel(socketValueFunilC, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel);
      materials.FunilC.userData.shader.uniforms.time.value += delta;
      materials.FunilC.userData.shader.uniforms.activateBlink.value = socketFaltaMaterialC ? 1.0 : 0.0;
    }
    if (materials.FunilD && materials.FunilD.userData.shader) {
      materials.FunilD.userData.shader.uniforms.fillLevel.value =
        getNormalizedFillLevel(socketValueFunilD, maxValueFunil, modelParams.initialFillLevel, modelParams.maxFillLevel);
      materials.FunilD.userData.shader.uniforms.time.value += delta;
      materials.FunilD.userData.shader.uniforms.activateBlink.value = socketFaltaMaterialD ? 1.0 : 0.0;
    }
    if (materials.BalacaA && materials.BalacaA.userData.shader) {
      materials.BalacaA.userData.shader.uniforms.fillLevel.value =
        getNormalizedFillLevel(socketValueBalacaA, maxValueBalacaA, modelParams.initialFillLevel, modelParams.maxFillLevel);
    }
    if (materials.Misturador && materials.Misturador.userData.shader) {
      materials.Misturador.userData.shader.uniforms.fillLevel.value =
        getNormalizedFillLevel(socketValueMisturador, maxValueMisturador, modelParams.initialFillLevel, modelParams.maxFillLevel);
    }
    // Atualiza o tempo e a flag de blink para sensores
    if (materials.SensorA && materials.SensorA.userData.shader) {
      materials.SensorA.userData.shader.uniforms.time.value += delta;
      materials.SensorA.userData.shader.uniforms.activateBlink.value = socketSensorA ? 1.0 : 0.0;
    }
    if (materials.SensorB && materials.SensorB.userData.shader) {
      materials.SensorB.userData.shader.uniforms.time.value += delta;
      materials.SensorB.userData.shader.uniforms.activateBlink.value = socketSensorB ? 1.0 : 0.0;
    }
    if (materials.SensorC && materials.SensorC.userData.shader) {
      materials.SensorC.userData.shader.uniforms.time.value += delta;
      materials.SensorC.userData.shader.uniforms.activateBlink.value = socketSensorC ? 1.0 : 0.0;
    }
    if (materials.SensorD && materials.SensorD.userData.shader) {
      materials.SensorD.userData.shader.uniforms.time.value += delta;
      materials.SensorD.userData.shader.uniforms.activateBlink.value = socketSensorD ? 1.0 : 0.0;
    }
    // Atualiza o tempo e a flag de blink para unidades de vácuo
    if (materials.VacuoA && materials.VacuoA.userData.shader) {
      materials.VacuoA.userData.shader.uniforms.time.value += delta;
      materials.VacuoA.userData.shader.uniforms.activateBlink.value = socketVacuoA ? 1.0 : 0.0;
    }
    if (materials.VacuoB && materials.VacuoB.userData.shader) {
      materials.VacuoB.userData.shader.uniforms.time.value += delta;
      materials.VacuoB.userData.shader.uniforms.activateBlink.value = socketVacuoB ? 1.0 : 0.0;
    }
    if (materials.VacuoC && materials.VacuoC.userData.shader) {
      materials.VacuoC.userData.shader.uniforms.time.value += delta;
      materials.VacuoC.userData.shader.uniforms.activateBlink.value = socketVacuoC ? 1.0 : 0.0;
    }
    if (materials.VacuoD && materials.VacuoD.userData.shader) {
      materials.VacuoD.userData.shader.uniforms.time.value += delta;
      materials.VacuoD.userData.shader.uniforms.activateBlink.value = socketVacuoD ? 1.0 : 0.0;
    }
  });

  scene.position.set(...modelParams.position);
  scene.rotation.set(...modelParams.rotation);
  scene.scale.set(...modelParams.scale);

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
          <Text
            color="white"
            fontSize={0.4}
            fontWeight="bold"
            position={labelPositions.receitaA}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false}
            rotation={[0.5, 0, 0]}
          >
            {receitas.receitaA.tag}
          </Text>
          <Text
            color="green"
            fontSize={0.4}
            fontWeight="bold"
            position={[labelPositions.receitaA[0], labelPositions.receitaA[1] - 0.6, labelPositions.receitaA[2]]}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false}
            rotation={[0.5, 0, 0]}
          >
            {`${receitas.receitaA.value.toFixed(2)} %`}
          </Text>
        </group>
      )}
      {materials.FunilB && (
        <group>
          <Text
            color="white"
            fontSize={0.4}
            fontWeight="bold"
            position={labelPositions.receitaB}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false}
            rotation={[0.5, 0, 0]}
          >
            {receitas.receitaB.tag}
          </Text>
          <Text
            color="green"
            fontSize={0.4}
            fontWeight="bold"
            position={[labelPositions.receitaB[0], labelPositions.receitaB[1] - 0.6, labelPositions.receitaB[2]]}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false}
            rotation={[0.5, 0, 0]}
          >
            {`${receitas.receitaB.value.toFixed(2)} %`}
          </Text>
        </group>
      )}
      {materials.FunilC && (
        <group>
          <Text
            color="white"
            fontSize={0.4}
            fontWeight="bold"
            position={labelPositions.receitaC}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false}
            rotation={[0.5, 0, 0]}
          >
            {receitas.receitaC.tag}
          </Text>
          <Text
            color="green"
            fontSize={0.4}
            fontWeight="bold"
            position={[labelPositions.receitaC[0], labelPositions.receitaC[1] - 0.6, labelPositions.receitaC[2]]}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false}
            rotation={[0.5, 0, 0]}
          >
            {`${receitas.receitaC.value.toFixed(2)} %`}
          </Text>
        </group>
      )}
      {materials.FunilD && (
        <group>
          <Text
            color="white"
            fontSize={0.4}
            fontWeight="bold"
            position={labelPositions.receitaD}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false}
            rotation={[0.5, 0, 0]}
          >
            {receitas.receitaD.tag}
          </Text>
          <Text
            color="green"
            fontSize={0.4}
            fontWeight="bold"
            position={[labelPositions.receitaD[0], labelPositions.receitaD[1] - 0.6, labelPositions.receitaD[2]]}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false}
            rotation={[0.5, 0, 0]}
          >
            {`${receitas.receitaD.value.toFixed(2)} %`}
          </Text>
        </group>
      )}
      {materials.BalacaA && (
        <group>
          <Text
            color="white"
            fontSize={0.4}
            fontWeight="bold"
            position={labelPositions.balancaA}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false}
            rotation={[0.5, 0, 0]}
          >
            {receitas.balancaA.tag}
          </Text>
          <Text
            color="green"
            fontSize={0.4}
            fontWeight="bold"
            position={[labelPositions.balancaA[0], labelPositions.balancaA[1] - 0.6, labelPositions.balancaA[2]]}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false}
            rotation={[0.5, 0, 0]}
          >
            {`${receitas.balancaA.value.toFixed(2)} Kg`}
          </Text>
        </group>
      )}
      {materials.Misturador && (
        <group>
          <Text
            color="white"
            fontSize={0.4}
            fontWeight="bold"
            position={labelPositions.mixer}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false}
            rotation={[0.5, 0, 0]}
          >
            {receitas.mixer.tag}
          </Text>
          <Text
            color="green"
            fontSize={0.4}
            fontWeight="bold"
            position={[labelPositions.mixer[0], labelPositions.mixer[1] - 0.6, labelPositions.mixer[2]]}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="rgba(0,0,0,0.8)"
            material-toneMapped={false}
            rotation={[0.5, 0, 0]}
          >
            {`${receitas.mixer.value.toFixed(2)} Kg`}
          </Text>
        </group>
      )}
    </group>
  );
};

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
      {modelParams.directionalLightPositions.map((pos, index) => (
        <directionalLight key={index} position={pos} intensity={modelParams.directionalLightIntensity} />
      ))}
      <hemisphereLight skyColor="white" groundColor="gray" intensity={modelParams.hemisphereLightIntensity} />
      <OrbitControls enableZoom={modelParams.enableZoom} />
      <Model path={modelPath} modelParams={modelParams} {...otherProps} />
    </Canvas>
  );
};

const ModelViewerWrapper = ({
  modelPath,
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
  const modelParams = {
    position: [0, -3.5, -3],
    rotation: [0.49, 2.93, 0],
    scale: [4.7, 4.7, 4.7],
    initialFillLevel: 0,
    fillSpeed: 0.1,
    maxFillLevel: 50,
    fillColor: colorFunil,
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
  };

  return (
    <Suspense fallback={<div>Carregando modelo 3D...</div>}>
      <ModelViewer
        modelPath={modelPath}
        modelParams={modelParams}
        maxValueFunil={maxValueFunil}
        colorFunil={colorFunil}
        maxValueBalacaA={maxValueBalacaA}
        colorBatch={colorBatch}
        maxValueMisturador={maxValueMisturador}
        colorMisturador={colorMisturador}
        socketValueFunilA={socketValueFunilA}
        socketValueFunilB={socketValueFunilB}
        socketValueFunilC={socketValueFunilC}
        socketValueFunilD={socketValueFunilD}
        socketValueBalacaA={socketValueBalacaA}
        socketValueMisturador={socketValueMisturador}
        socketFaltaMaterialA={socketFaltaMaterialA}
        socketFaltaMaterialB={socketFaltaMaterialB}
        socketFaltaMaterialC={socketFaltaMaterialC}
        socketFaltaMaterialD={socketFaltaMaterialD}
        socketReceitaA={socketReceitaA}
        socketReceitaB={socketReceitaB}
        socketReceitaC={socketReceitaC}
        socketReceitaD={socketReceitaD}
        socketTagA={socketTagA}
        socketTagB={socketTagB}
        socketTagC={socketTagC}
        socketTagD={socketTagD}
        socketSensorA={socketSensorA}
        socketSensorB={socketSensorB}
        socketSensorC={socketSensorC}
        socketSensorD={socketSensorD}
        socketVacuoA={socketVacuoA}
        socketVacuoB={socketVacuoB}
        socketVacuoC={socketVacuoC}
        socketVacuoD={socketVacuoD}
        socketReceitaBalancaA={socketReceitaBalancaA}
        socketTagBalanca={socketTagBalanca}
        socketReceitaMisturador={socketReceitaMisturador}
        socketTagMisturador={socketTagMisturador}
      />
    </Suspense>
  );
};

export default ModelViewerWrapper;
