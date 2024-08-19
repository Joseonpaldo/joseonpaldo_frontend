import {forwardRef} from "react";
import {arrowStyle, StateBuildStyle, YutNameStyle, YutStateStyle} from "@/components/game/YutPanStyle";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";

export const stateMouseOver = (e) => {
  const element = e.target;
  element.querySelector(".yutName").style.scale = "1.5";
}

export const stateMouseOut = (e) => {
  const element = e.target;
  element.querySelector(".yutName").style.scale = "0.7";
}

export const YutThrowBtnOver = (e) => {
  const element = e.target;
  if (element.style.backgroundImage === `url("/image/Btthrow.normal.0.png")`) {
    element.style.backgroundImage = `url("/image/Btthrow.mouseOver.0.png")`;
  }
}

export const YutThrowBtnOut = (e) => {
  const element = e.target;
  if (element.style.backgroundImage === `url("/image/Btthrow.mouseOver.0.png")`) {
    element.style.backgroundImage = `url("/image/Btthrow.normal.0.png")`;
  }
}

export const YutThrowBtnDown = (e) => {
  const element = e.target;
  if (element.style.backgroundImage === `url("/image/Btthrow.mouseOver.0.png")`) {
    element.style.backgroundImage = `url("/image/Btthrow.pressed.0.png")`;
  }
}
export const YutThrowBtnUp = (e) => {
  const element = e.target;
  if (element.style.backgroundImage === `url("/image/Btthrow.pressed.0.png")`) {
    element.style.backgroundImage = `url("/image/Btthrow.disabled.0.png")`;
  }
}


export const arrowMouseOver = (e) => {
  e.currentTarget.querySelector("img").style.filter = "drop-shadow(0px 0px 7px #ff0)";
}
export const arrowMouseOut = (e) => {
  e.currentTarget.querySelector("img").style.filter = "drop-shadow(0px 0px 0px #ff0)";
}


export const playerNumberStyle = (color) => ({
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: '24px',
  border: '7px solid ' + color,
});


export const YutState = forwardRef(({index, name, left, top, border, onMouseOver, onMouseOut}, ref) => {
  return (
    <div
      ref={ref}
      className={`YutState${index} YutState`}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{
        ...YutStateStyle,
        left: `${left}px`,
        top: `${top}px`,
        border: border,
      }}
    >
      <div style={YutNameStyle} className="yutName">{name}</div>
      <div style={StateBuildStyle} className="buildState"></div>
    </div>
  );
});


export const Arrow = forwardRef(({index, left, top, onMouseOver, onMouseOut, onClick}, ref) => {
  return (
    <div
      ref={ref}
      className={`arrowIndex${index} arrowIndex`}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}
      style={{
        ...arrowStyle,

        left: `${left + 10}px`,
        top: `${top - 35}px`,
      }}
    >
      <img src="/image/underArrow.png" alt="" style={{width: "100%"}}/>
    </div>
  );
});

export const BuyEstateConfirmDialog = ({open, onClose}) => {

  const handleAgree = () => {
    onClose(true); // Agree 버튼 클릭 시 true 반환
  };

  const handleDisagree = () => {
    onClose(false); // Disagree 버튼 클릭 시 false 반환
  };


  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"해당 땅을 구입하시겠습니까?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{textAlign: 'center'}}>
          <img src="/image/level1.png" alt="" width="70%"/>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree} color="primary">
          취소
        </Button>
        <Button onClick={handleAgree} color="primary">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  )
}



export const UpgradeEstateConfirmDialog = ({open, onClose, level}) => {

  const handleAgree = () => {
    onClose(true); // Agree 버튼 클릭 시 true 반환
  };

  const handleDisagree = () => {
    onClose(false); // Disagree 버튼 클릭 시 false 반환
  };

  if (level === 3) {
    handleDisagree();
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"해당 땅을 승급하시겠습니까?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{textAlign: 'center'}}>
          <img src={`/image/level${level}.png`} alt="" width="40%"/>
          <img src="/image/underArrow.png" width="10%" style={{rotate: '270deg'}}/>
          <img src={`/image/level${level+1}.png`} alt="" width="40%"/>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree} color="primary">
          취소
        </Button>
        <Button onClick={handleAgree} color="primary">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  )
}
