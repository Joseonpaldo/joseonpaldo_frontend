const YutNameStyle = {
  position: "absolute",
  top: "-32px",
  opacity: 1,
  left: "-25px",
  fontSize: "10px",
  textAlign: "center",
  width: "50px",
  transition: "all 0.3s ease-in-out",
  zIndex: 5,
  pointerEvents: "none",
  textShadow: "black 0px 0px 3px",
  fontWeight: "bold",
  color: "white",
  scale: "0.7"
}

const YutStateStyle = {
  position: "absolute",
  borderRadius: "13px",
  boxShadow: "1px 1px 6px black",
}

const StateBuildStyle = {
  position: "absolute",
  top: "-1px",
  left: 0,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  width: "80px",
  height: "43px",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
  filter: "drop-shadow(1px 1px 2px #444)"
}

const YutFanBackGroundStyle = {
  position: "absolute",
  top: -20,
  left: -20,
  width: "500px",
  height: "500px",
  background: "lightgray",
  borderRadius: "5%",
  opacity: 0.8,
}

const YutThrowBtnStyle = {
  left: 149,
  top: 325.05,
  width: 161,
  height: 45,
  scale: '0.7',
  position: 'absolute',
  backgroundImage: `url("/image/Btthrow.disabled.0.png")`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
}

const YetResultBtnStyle = {
  left: 124,
  top: 65,
  width: 210,
  height: 30,
  scale: "0.8",
  position: 'absolute',
  display: "flex",
  justifyContent: "space-evenly",
}


const playerNameStyle = {
  fontSize: "14px",
  fontWeight: "bolder",
  display: "inline-block",
  width: "auto",
  textAlign: "center",
  position: "absolute",
  bottom: "-10px",
  left: "50%",
  transform: "translateX(-50%)",
}

const arrowStyle = {
  position: "absolute",
  width: 20,
  height: 30,
  display: "none",
}

const backStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `url("/image/background.jpg")`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  overflow: "hidden",
};


const containerStyle = {
  position: "absolute",
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  pointerEvents: "none",
};


const cardStyle = {
  position: "absolute",
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '16px',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  gap: '16px',
  pointerEvents: "auto",
  // scale : "0.7",
};

const rankStyle = {
  textAlign: 'right',
  fontSize: '32px',
  fontWeight: 'bold',
};



export {
  YutNameStyle,
  YutStateStyle,
  StateBuildStyle,
  YutFanBackGroundStyle,
  YutThrowBtnStyle,
  YetResultBtnStyle,
  playerNameStyle,
  arrowStyle,
  backStyle,
  containerStyle,
  cardStyle,
  rankStyle,
}
