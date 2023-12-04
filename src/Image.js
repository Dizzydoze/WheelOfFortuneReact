function Image({src, x, y}){

    return (
        <>
            {(x)
                ? <img className='image' alt='gif' src={src}
                       style={{position: "fixed",
                           left: `${x}%`,
                           top: `${y}%`,
                           // bottom: 90,
                           width: '235px',
                           height: '235px'}}></img>
                : <img className='image' alt='gif' src={src} ></img>
            }
        </>
    )
}

export default Image;