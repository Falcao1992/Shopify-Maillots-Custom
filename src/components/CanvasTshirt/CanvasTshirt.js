import React, {useEffect, useState, useLayoutEffect, useRef} from "react";
import styled from "styled-components";

import logoOm from "../../../resources/logoOm.png"
import batmanSmall from "../../../resources/batman_small.png"
import {fabric} from "fabric"
import domtoimage from 'dom-to-image';

import { Icon, InlineIcon } from '@iconify/react';
import baselineAddPhotoAlternate from '@iconify/icons-ic/baseline-add-photo-alternate';
import roundClear from '@iconify/icons-ic/round-clear';



const CanvasTshirt = ({shirtImages}) => {


    const [colorChoose, setColorChoose] = useState("#fff")
    const [canvas, setCanvas] = useState(null)
    const [canvasObjects, setCanvasObjects] = useState(null)
    const [initCanvas, setInitCanvas] = useState(false)
    const [arrayShirtImages, setArrayShirtImages] = useState(shirtImages)

    const [newImage, setNewImage] = useState(null)

    const [addBorder, setAddBorder] = useState(true)
    const [editing, setEditing] = useState(false)
    const CanvaExport = useRef(null)

    const colorsAvailable = [
        {colorName: "WHITE", colorCode: "#FFFFFF"},
        {colorName: "SILVER", colorCode: "#C0C0C0"},
        {colorName: "GRAY", colorCode: "#808080"},
        {colorName: "BLACK", colorCode: "#000000"},
        {colorName: "RED", colorCode: "#FF0000"},
        {colorName: "MAROON", colorCode: "#800000"},
        {colorName: "YELLOW", colorCode: "#FFFF00"},
        {colorName: "OLIVE", colorCode: "#808000"},
        {colorName: "LIME", colorCode: "#00FF00"},
        {colorName: "GREEN", colorCode: "#008000"},
        {colorName: "TEAL", colorCode: "#008080"},
        {colorName: "BLUE", colorCode: "#0000FF"},
        {colorName: "NAVY", colorCode: "#000080"},
        {colorName: "FUCHSIA", colorCode: "#FF00FF"},
        {colorName: "PURPLE", colorCode: "#800080"},
    ]

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
            checkItemsInCanvas()
        }
    }, [canvasObjects])

    const updateTshirtImage = (imageURL) => {
        setEditing(true)
        fabric.Image.fromURL(imageURL, function (oImg) {
            canvas.setHeight(canvas.wrapperEl.offsetParent.clientHeight);
            canvas.setWidth(canvas.wrapperEl.offsetParent.clientWidth);
            oImg.scale(0.10)
            canvas.centerObject(oImg);
            canvas.add(oImg);
            canvas.renderAll();
        })
    }

    const checkItemsInCanvas = () => {
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
        setEditing(true)
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
                img.scale(0.05)
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
            setEditing(false)
        }).catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
    }

    const debugBase64 = (base64URL) => {
        setAddBorder(false)
        const win = window.open();
        win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        win.document.close()
    }

    return (
        <ContainerCanvasTshirt>
            {console.log('render composant canvas tshirt')}
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

                <div>
                    <label htmlFor="tshirt-design">Choisir un logo:</label>
                    <select
                        id="logoAdd"
                        onChange={(e) => updateTshirtImage(e.target.value)}
                    >
                        <option value="">Select one of our designs ...</option>
                        <option value={logoOm}>Logo Marseille</option>
                        <option value={batmanSmall}>Batman</option>
                    </select>
                </div>

                <div>
                    {colorsAvailable.map( (c) => {
                        return (
                            <ColorShirt
                                key={c.colorName}
                                colorshirt={c.colorCode}
                                onClick={() => setColorChoose(c.colorCode)}
                            />
                        )
                    })}
                </div>

                <div>
                    <label htmlFor="tshirt-custompicture"><Icon icon={baselineAddPhotoAlternate} width="40px" height="40px" /></label>
                    <CanvasInputImage
                        type="file"
                        accept="image/*"
                        id="tshirt-custompicture"
                        onChange={uploadImage}
                    />
                    <div onClick={deleteActiveItem}><Icon icon={roundClear} width="40px" height="40px" /></div>
                </div>

                    <button type="button" onClick={checkItemsInCanvas}>consoleLog</button>
                    <button type="button" disabled={!editing} onClick={handleImageCustomExport}>Export images:</button>
                <div>
                    <input type="checkbox" id="scales" name="scales"
                           onChange={() => setAddBorder(!addBorder)}
                           checked={addBorder}
                    />
                        <label htmlFor="scales">{addBorder ? 'Enlever' : 'Ajouter'} cadres</label>
                </div>
            </BlockOptions>
            {newImage !== null && <div><img src={newImage} alt={"maillot perso"}/></div>}
            {newImage !== null && <button type='button' onClick={() =>debugBase64(newImage)}>ouvir dans un nouvelle onglet</button> }
        </ContainerCanvasTshirt>

    )
}

const ContainerCanvasTshirt = styled.section`
    display: flex;
    flex-direction: column;
    @media screen and (min-width: 750px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
`

const BlockCanvasTshirt = styled.article`
    width: 70%;
    display: flex;
    align-self: center;
    position: relative;
    background-color: #fff;

    @media screen and (min-width: 750px) {
        width: 30%;
    }
`

const BlockOptions = styled.form`
    display: flex;
    flex-direction: column;
    > div {
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }
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
    overflow: hidden;
`

const CanvasStyled = styled.canvas`
    position: absolute;
    left: 0;
    top: 0;
    user-select: none;
    cursor: default;
`
const ColorShirt = styled.div`
    width: 30px;
    height: 30px;
    background-color: ${props => props.colorshirt};
`

const CanvasInputImage = styled.input`
    display: none;
`

export default CanvasTshirt
