import WOF from "./WOFLogo.avif";

/**
 * seperated image component
 * @returns {JSX.Element}
 * @constructor
 */
function Image(){
    return (
        <img className="image" src={WOF} alt="WheelOfFortune"></img>
    )
}

export default Image;
