import React, {useEffect, useState, useLayoutEffect} from "react";
import styled from "styled-components";
import modelTshirt from "../../../resources/background_tshirt.png"
import logoOm from "../../../resources/logoOm.png"
import batmanSmall from "../../../resources/batman_small.png"
import {fabric} from "fabric"

const CanvasTshirt = () => {


    const [colorChoose, setColorChoose] = useState("#fff")
    const [canvas, setCanvas] = useState(null)
    const [canvasObjects, setCanvasObjects] = useState(null)
    const [initCanvas, setInitCanvas] = useState(false)

    /*
    * Method that adds an image to the T-Shirt canvas from a web URL.
    *
    * @param {String} imageUrl      The server URL of the image that you want to load on the T-Shirt.
    *
    * @return {void} Return value description.
    */

    useEffect(() => {
        const canvas = new fabric.Canvas('logo', {
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
            console.log("canvas", canvas)
            console.log("objects", objects)
            setCanvasObjects(objects.length)
            console.log("canvasObjects", canvasObjects)
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


    /*
    const uploadImage = (e) => {
        const reader = new FileReader();

        reader.onload = function (event){
            const imgObj = new Image();
            imgObj.src = event.target.result;

            //console.log(imgObj, "imgObj")

            // When the picture loads, create the image in Fabric.js
            imgObj.onload = function () {
                const img = new fabric.Image(imgObj);
                console.log(img, "imgCanvas")

                img.scaleToHeight(300);
                img.scaleToWidth(300);
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
    }*/


    return (
        <ContainerCanvasTshirt>
            <BlockCanvasTshirt>
                <ModeleTshirtPicture
                    colorshirt={colorChoose}
                    alt="tshirt background"
                    src={modelTshirt}/>
                <DrawingArea>
                    <CanvasContainer id="test">
                        <CanvasStyled id="logo">le caneva styled</CanvasStyled>
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
                <br/>
                <label htmlFor="tshirt-color">T-Shirt Color:</label>
                <select id="tshirt-color" onChange={(e) => setColorChoose(e.target.value)}>
                    <option value="#fff">White</option>
                    <option value="#000">Black</option>
                    <option value="#f00">Red</option>
                    <option value="#008000">Green</option>
                    <option value="#ff0">Yellow</option>
                </select>

                <br/>
                <label htmlFor="tshirt-custompicture">Upload your own design:</label>
                <input
                    type="file"
                    id="tshirt-custompicture"
                    //onChange={uploadImage}
                />
            </BlockOptions>
        </ContainerCanvasTshirt>

    )
}

const ContainerCanvasTshirt = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`

const BlockCanvasTshirt = styled.div`
    width: 30%;
    position: relative;
    background-color: #fff;
`

const BlockOptions = styled.div`

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
    border: 1px solid blue;
`

const CanvasStyled = styled.canvas`
    position: absolute;
    //width: inherit !important;
    //height: inherit !important; 
    left: 0; 
    top: 0; 
    user-select: none; 
    cursor: default;
`

export default CanvasTshirt
