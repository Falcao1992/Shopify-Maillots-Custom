import React, {useEffect, useState, useLayoutEffect, useRef} from "react";
import styled from "styled-components";
import modelTshirt from "../../../resources/background_tshirt.png"
import logoOm from "../../../resources/logoOm.png"
import batmanSmall from "../../../resources/batman_small.png"
import {fabric} from "fabric"
import domtoimage from 'dom-to-image';

const CanvasTshirt = ({shirtImages}) => {


    const [colorChoose, setColorChoose] = useState("#fff")
    const [canvas, setCanvas] = useState(null)
    const [canvasObjects, setCanvasObjects] = useState(null)
    const [initCanvas, setInitCanvas] = useState(false)
    const [arrayShirtImages, setArrayShirtImages] = useState(shirtImages)

    const [newImage, setNewImage] = useState(null)

    const [addBorder, setAddBorder] = useState(true)

    const CanvaExport = useRef(null)

    /*
    * Method that adds an image to the T-Shirt canvas from a web URL.
    *
    * @param {String} imageUrl      The server URL of the image that you want to load on the T-Shirt.
    *
    * @return {void} Return value description.
    */

    console.log("arrayShirtImages", arrayShirtImages)

    useEffect(() => {
        const canvas = new fabric.Canvas('shirtCanvas', {
            preserveObjectStacking: true,
        })
        setCanvas(canvas)
        setInitCanvas(true)
    }, [])

    useEffect(() => {
        console.log("largeur tableau objet a été modifer")
        if (initCanvas === true) {
            testModif()
        }
    }, [canvasObjects])

    const updateTshirtImage = (imageURL) => {
        fabric.Image.fromURL(imageURL, function (oImg) {
            canvas.setHeight(canvas.wrapperEl.offsetParent.clientHeight);
            canvas.setWidth(canvas.wrapperEl.offsetParent.clientWidth);
            oImg.scale(0.25)
            canvas.centerObject(oImg);
            canvas.add(oImg);
            canvas.renderAll();
        })
    }

    const testModif = () => {
        if (canvas._objects.length === 0) {
            console.log("pas d'item dans le canvas")
        } else {
            const objects = canvas.getObjects('image');
            setCanvasObjects(objects.length)
            objects.forEach((item, i) => {
                    if (item.aCoords.tl.x < 0) {
                        console.log("l'objets a été supprimé car il ne rentré pas dans le cadre")
                        canvas.remove(objects[i]);
                    } else {
                        console.log("rien a supprimer")
                    }
                }
            )
        }
    }

    const uploadImage = (e) => {
        const reader = new FileReader();
        reader.onload = function (event){
            const imgObj = new Image();
            imgObj.src = event.target.result;
            // When the picture loads, create the image in Fabric.js
            imgObj.onload = function () {
                const img = new fabric.Image(imgObj);
                console.log(img, "imgCanvas")
                console.log(canvas.wrapperEl.offsetParent.clientHeight + 1, "canvas.wrapperEl.offsetParent.clientHeight")
                canvas.setHeight(canvas.wrapperEl.offsetParent.clientHeight);
                canvas.setWidth(canvas.wrapperEl.offsetParent.clientWidth);
                img.scale(0.1)
                canvas.centerObject(img);
                canvas.add(img);
                canvas.renderAll();
            };
        };
        console.log(e.target.files[0], "etargetfiles")

        // If the user selected a picture, load it
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const deleteActiveItem = () => {
        const activeObject = canvas.getActiveObject()
        canvas.remove(activeObject)
    }

    const handleImageCustomExport = () => {
        setAddBorder(false)
        console.log(CanvaExport.current)
        domtoimage.toPng(CanvaExport.current, { quality: 1.0 }).then(function (dataUrl) {
            // Print the data URL of the picture in the Console
            console.log(dataUrl);
            setNewImage(dataUrl)
        }).catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
    }

    return (
        <ContainerCanvasTshirt>
            <BlockCanvasTshirt ref={CanvaExport}>
                <ModeleTshirtPicture
                    colorshirt={colorChoose}
                    alt="tshirt background"
                    src={arrayShirtImages[0].originalSrc}/>
                <DrawingArea>
                    <CanvasContainer border={addBorder}>
                        <CanvasStyled id="shirtCanvas">le caneva styled</CanvasStyled>
                    </CanvasContainer>
                </DrawingArea>
            </BlockCanvasTshirt>

            <BlockOptions>
                <button type="button" onClick={testModif}>consoleLog</button>
                <label htmlFor="tshirt-design">logo:</label>
                <select
                    id="logoAdd"
                    onChange={(e) => updateTshirtImage(e.target.value)}
                >
                    <option value="">Select one of our designs ...</option>
                    <option value={logoOm}>Logo Marseille</option>
                    <option value={batmanSmall}>Batman</option>
                </select>

                <label htmlFor="tshirt-color">T-Shirt Color:</label>
                <select id="tshirt-color" onChange={(e) => setColorChoose(e.target.value)}>
                    <option value="#fff">White</option>
                    <option value="#000">Black</option>
                    <option value="#f00">Red</option>
                    <option value="#008000">Green</option>
                    <option value="#ff0">Yellow</option>
                </select>

                <label htmlFor="tshirt-custompicture">Télécharger une Photo:</label>
                <input
                    type="file"
                    id="tshirt-custompicture"
                    onChange={uploadImage}
                />

                <button type="button" onClick={deleteActiveItem}>Supprimer Item selectionné:</button>
                <button type="button" onClick={handleImageCustomExport}>Export images:</button>
                <div>
                    <input type="checkbox" id="scales" name="scales"
                           onClick={() => setAddBorder(!addBorder)}
                           checked={addBorder}
                    />
                        <label htmlFor="scales">{addBorder ? 'Enlever' : 'Ajouter'} cadres</label>
                </div>
            </BlockOptions>
            {newImage !== null && <a target="_blank" rel="noopener noreferrer" ><img src={newImage} alt={"maillot perso"}/></a>}
        </ContainerCanvasTshirt>

    )
}

const ContainerCanvasTshirt = styled.div`
    display: flex;
    flex-direction: column;
    @media screen and (min-width: 750px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
`

const BlockCanvasTshirt = styled.div`
    width: 100%;
    position: relative;
    background-color: #fff;
    @media screen and (min-width: 750px) {
        width: 30%;
    }
`

const BlockOptions = styled.div`
    display: flex;
    flex-direction: column;
`
const ModeleTshirtPicture = styled.img`
    width: 100%;
    display: flex;
    background-color: ${props => props.colorshirt};
`

const DrawingArea = styled.div`
    position: absolute;
    width: 50%;
    height: 75%;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 10;
`

const CanvasContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    user-select: none;
    border: ${props => props.border ? "1px solid blue" : "1px solid transparent"};
`

const CanvasStyled = styled.canvas`
    position: absolute;
    left: 0;
    top: 0;
    user-select: none;
    cursor: default;
`

export default CanvasTshirt
