import React, { useEffect, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import * as THREE from 'three';

/**
 * Map from Mixamo rig bone names to VRM Humanoid bone names.
 */
const mixamoVRMRigMap = {
  'mixamorig:Hips': 'hips',
  'mixamorig:Spine': 'spine',
  'mixamorig:Spine1': 'chest',
  'mixamorig:Spine2': 'upperChest',
  'mixamorig:Neck': 'neck',
  'mixamorig:Head': 'head',
  'mixamorig:LeftShoulder': 'leftShoulder',
  'mixamorig:LeftArm': 'leftUpperArm',
  'mixamorig:LeftForeArm': 'leftLowerArm',
  'mixamorig:LeftHand': 'leftHand',
  'mixamorig:LeftHandThumb1': 'leftThumbMetacarpal',
  'mixamorig:LeftHandThumb2': 'leftThumbProximal',
  'mixamorig:LeftHandThumb3': 'leftThumbDistal',
  'mixamorig:LeftHandIndex1': 'leftIndexProximal',
  'mixamorig:LeftHandIndex2': 'leftIndexIntermediate',
  'mixamorig:LeftHandIndex3': 'leftIndexDistal',
  'mixamorig:LeftHandMiddle1': 'leftMiddleProximal',
  'mixamorig:LeftHandMiddle2': 'leftMiddleIntermediate',
  'mixamorig:LeftHandMiddle3': 'leftMiddleDistal',
  'mixamorig:LeftHandRing1': 'leftRingProximal',
  'mixamorig:LeftHandRing2': 'leftRingIntermediate',
  'mixamorig:LeftHandRing3': 'leftRingDistal',
  'mixamorig:LeftHandPinky1': 'leftLittleProximal',
  'mixamorig:LeftHandPinky2': 'leftLittleIntermediate',
  'mixamorig:LeftHandPinky3': 'leftLittleDistal',
  'mixamorig:RightShoulder': 'rightShoulder',
  'mixamorig:RightArm': 'rightUpperArm',
  'mixamorig:RightForeArm': 'rightLowerArm',
  'mixamorig:RightHand': 'rightHand',
  'mixamorig:RightHandThumb1': 'rightThumbMetacarpal',
  'mixamorig:RightHandThumb2': 'rightThumbProximal',
  'mixamorig:RightHandThumb3': 'rightThumbDistal',
  'mixamorig:RightHandIndex1': 'rightIndexProximal',
  'mixamorig:RightHandIndex2': 'rightIndexIntermediate',
  'mixamorig:RightHandIndex3': 'rightIndexDistal',
  'mixamorig:RightHandMiddle1': 'rightMiddleProximal',
  'mixamorig:RightHandMiddle2': 'rightMiddleIntermediate',
  'mixamorig:RightHandMiddle3': 'rightMiddleDistal',
  'mixamorig:RightHandRing1': 'rightRingProximal',
  'mixamorig:RightHandRing2': 'rightRingIntermediate',
  'mixamorig:RightHandRing3': 'rightRingDistal',
  'mixamorig:RightHandPinky1': 'rightLittleProximal',
  'mixamorig:RightHandPinky2': 'rightLittleIntermediate',
  'mixamorig:RightHandPinky3': 'rightLittleDistal',
  'mixamorig:LeftUpLeg': 'leftUpperLeg',
  'mixamorig:LeftLeg': 'leftLowerLeg',
  'mixamorig:LeftFoot': 'leftFoot',
  'mixamorig:LeftToeBase': 'leftToes',
  'mixamorig:RightUpLeg': 'rightUpperLeg',
  'mixamorig:RightLeg': 'rightLowerLeg',
  'mixamorig:RightFoot': 'rightFoot',
  'mixamorig:RightToeBase': 'rightToes',
};

export function Avatar({ modelUrl, animationUrl }) {
  const gltf = useLoader(GLTFLoader, modelUrl, (loader) => {
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });
  });

  const { animations: fbxAnimations } = useFBX(animationUrl);
  const vrm = gltf.userData.vrm;
  const mixer = useRef();

  useEffect(() => {
    if (!vrm || !fbxAnimations || fbxAnimations.length === 0) return;

    // Rotate model if necessary (VRM 0.0 compatibility helper)
    VRMUtils.rotateVRM0(vrm);

    const clip = fbxAnimations[0];
    const tracks = [];

    clip.tracks.forEach((track) => {
      // Extract bone name and property (position/quaternion/scale)
      // track.name format: "mixamorig:BoneName.property"
      // We split by '.' but handle namespaces if present
      const trackNameParts = track.name.split('.');
      const property = trackNameParts.pop(); // last part is property
      const boneName = trackNameParts.join('.'); // rest is bone name

      const vrmBoneName = mixamoVRMRigMap[boneName];

      if (vrmBoneName) {
        // Find the actual node in the VRM
        const vrmNode = vrm.humanoid.getNormalizedBoneNode(vrmBoneName);

        if (vrmNode) {
          const vrmNodeName = vrmNode.name;
          const newTrackName = `${vrmNodeName}.${property}`;

          // Hips Position Handling:
          // Mixamo animations often have root motion on the Hips.
          // If the model floats or sinks, it's usually because of the Hips position track.
          // We can exclude it to keep the model at its default height (grounded).
          if (vrmBoneName === 'hips' && property === 'position') {
            // Skip hip position to prevent floating/sinking issues.
            // This relies on the model being placed correctly in the scene.
            return;
          }

          const newTrack = track.clone();
          newTrack.name = newTrackName;
          tracks.push(newTrack);
        }
      }
    });

    const retargetedClip = new THREE.AnimationClip('vrmAnimation', clip.duration, tracks);

    // Create mixer on the VRM scene (Root)
    mixer.current = new THREE.AnimationMixer(vrm.scene);

    // Play the action
    const action = mixer.current.clipAction(retargetedClip);
    action.play();

    return () => {
      mixer.current?.stopAllAction();
    };
  }, [vrm, fbxAnimations]);

  useFrame((state, delta) => {
    mixer.current?.update(delta);
    vrm?.update(delta); // Important for physics (SpringBone) and MToon
  });

  return <primitive object={gltf.scene} />;
}
