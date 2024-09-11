import React from 'react';
import io from 'socket.io-client';
import AlienShooter from './components/AlienShooter';
import AlienViewer from './components/AlienViewer';
import Game from './components/game';
import Viewer from './components/viewer';
import RockPaperScissors from './components/RockPaperScissors';
import RockPaperScissorsViewer from './components/RPSViewer';
import Bomb from './components/Bomb';
import BombViewer from './components/BombViewer';

const Minigame = ({param, roomNumber}) => {
    const [role, setRole] = React.useState(null);
    const [gameType, setGameType] = React.useState(null);
    const [socket, setSocket] = React.useState(null);

    React.useEffect(() => {
        const soc = io('http://localhost:4000', {
            path: '/nws'
        });
        setSocket(soc);
    }, []);

    React.useEffect(() => {
        if(param > 10) {
            setRole('viewer');
            switch(param) {
                case 11:
                    setGameType('alienShooting');
                    break;
                case 12:
                    setGameType('platformer');
                    break;
                case 13:
                    setGameType('RPS');
                    break;
                case 14:
                    setGameType('bomb');
                    break;
                default:
                    setGameType(null);
            }
        }else {
            setRole('host');
            switch(param) {
                case 1:
                    setGameType('alienShooting');
                    break;
                case 2:
                    setGameType('platformer');
                    break;
                case 3:
                    setGameType('RPS');
                    break;
                case 4:
                    setGameType('bomb');
                    break;
                default:
                    setGameType(null);
            }
        }
    });

    React.useEffect(() => {
        if(gameType && role){
            console.log('joinRoom is in action');
            console.log(gameType, roomNumber, role);
            socket.emit('joinGame', { gameType, roomNumber, role });
        }
    }, [gameType, role])


    return (
        <div>
            {role === 'host' && gameType === 'alienShooting' && <AlienShooter socket={socket} />}
            {role === 'viewer' && gameType === 'alienShooting' && <AlienViewer socket={socket} />}
            {role === 'host' && gameType === 'platformer' && <Game socket={socket} />}
            {role === 'viewer' && gameType === 'platformer' && <Viewer socket={socket} />}
            {role === 'host' && gameType === 'RPS' && <RockPaperScissors socket={socket} />}
            {role === 'viewer' && gameType === 'RPS' && <RockPaperScissorsViewer socket={socket} />}
            {role === 'host' && gameType === 'bomb' && <Bomb socket={socket} />}
            {role === 'viewer' && gameType === 'bomb' && <BombViewer socket={socket} />}
        </div>
    )
}

export default Minigame;