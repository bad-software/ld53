import {
  ArcRotateCamera,
  CubeTexture,
  DirectionalLight,
  Engine,
  LensRenderingPipeline,
  PointerInfo,
  PointerInput,
  Scene,
  SceneLoader,
  Scalar,
  Vector3
} from '@babylonjs/core'

import '@babylonjs/loaders/glTF'
import avatarFile from 'Assets/models/HVGirl.glb'
import environmentMap from 'Assets/textures/dds/graySpecularHDR.dds'


SceneLoader.ShowLoadingScreen = false


export async function init( canvas ) {
  const
    engine = new Engine( canvas, true ),
    { camera, scene } = await createScene({ canvas, engine })

  engine.runRenderLoop(() => {
    scene.render()
  })
}


async function createScene({ canvas, engine }) {
  // const scene = new Scene( engine )
  const
    scene = await SceneLoader.LoadAsync( avatarFile, '', engine ),

    camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2,
      2,
      new Vector3( 0, 20, -10 ),
      scene
    ),

    /*lensEffect = new LensRenderingPipeline( 'lens',
      {
        // chromatic_aberration: 0.05,
        // distortion: 0.25,
      },
      scene,
      1.0,
      camera
    ),*/

    hdrTexture = CubeTexture.CreateFromPrefilteredData(
      environmentMap,
      scene
    ),

    skybox = scene.createDefaultSkybox( hdrTexture, true )

  // camera.attachControl( canvas, true )


  const mesh = scene.meshes[0]
  // mesh.scaling.scaleInPlace( 0.1 )

  // Rotate 180 degrees.
  mesh.addRotation( 0, Math.PI, 0 )

  return { scene }
}
