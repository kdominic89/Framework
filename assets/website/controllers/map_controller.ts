import {Controller} from '@hotwired/stimulus';
import * as THREE from 'three'
import {GLTFLoader, GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {OrthographicCamera} from "three/src/cameras/OrthographicCamera";
import {Vector3} from "three";
import Stats from "three/examples/jsm/libs/stats.module";

type TileItem = {
    fileName: string;
    mapName: string;
    threeObj: object
};

export default class extends Controller {
    connect() {
        const container: Element = this.element;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const aspectRatio = width / height;
        const mapDataJson = JSON.parse(container.getAttribute('data-map'));
        const tilePath = container.getAttribute('data-tilePath');
        const camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 5000);
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        const loader = new GLTFLoader();


        const tileList: Map<string, TileItem> = new Map(
            [
                ['0000', {
                    fileName: 'gras',
                    mapName: '0000',
                    threeObj: {}
                }],
                ['0001', {
                    fileName: 'sea',
                    mapName: '0001',
                    threeObj: {}
                }]
            ]
        );
        
        this.loadTileList(loader, tilePath, tileList).then((tileList) => {
            mapDataJson.layers.background.forEach(function (tileJson) {
                let currentTile = tileList.get(tileJson.data);
                console.log(currentTile.threeObj.scene.children[0]);
                scene.add(currentTile.threeObj.scene);

            });
            console.log(scene);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);
            renderer.render(scene, camera);
        });
    }
    
    loadTileList(loader: any, tilePath: string, tileList: Map<string, TileItem>): Promise<Map<string, TileItem>> {
        return new Promise(async (resolve) => {
            for (const [_, tileItem] of tileList) {
                tileItem.threeObj = await loader.loadAsync(`${tilePath}/${tileItem.fileName}.glb`);
            }
            resolve(tileList);
        });
    }
}
