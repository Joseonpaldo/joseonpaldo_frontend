import React from 'react';
import io from 'socket.io-client';
import AlienShooter from './components/AlienShooter';
import AlienViewer from './components/AlienViewer';
import Game from './components/game';
import Viewer from './components/viewer';
import RockPaperScissors from './components/RockPaperScissors';
import RPSviewer from './components/RPSviewer';
import Bomb from './components/Bomb';
import BombViewer from './components/BombViewer';
import {useParams} from "next/navigation";
import { set } from 'react-hook-form';

const Minigame = ({param, roomNumber, javaSocket, player}) => {
    const [role, setRole] = React.useState(null);
    const [gameType, setGameType] = React.useState(null);
    const [socket, setSocket] = React.useState(null);

    const {roomId} = useParams();

    React.useEffect(() => {
        const soc = io('https://joseonpaldo.site', {
            path: '/nws'
        });
        setSocket(soc);
    }, []);

    React.useEffect(() => {
        if(socket) {
            socket.on('hostResult', (result) => {
                // Send Game Result to the Main Game for Update
              javaSocket.send(
                `/app/mini-game/isWin/${roomId}`,
                {
                  result: result,
                  name: player.player,
                },
                JSON.stringify({message: "is win"})
              );
                if(result === true) {

                }else {

                }
            });

            socket.on('disconnect', () => {
                console.log('socket disconnected');
            });
        }
    }, [socket]);

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
                case 15:
                    setGameType('mugunghwa');
                    break;
                case 16:
                    setGameType('snake');
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
                case 5:
                    setGameType('mugunghwa');
                    break;
                case 6:
                    setGameType('snake');
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
            if(gameType === 'mugunghwa' || gameType === 'snake'){
                socket.emit('joinRoom', { roomId: roomNumber, socketId: socket.id, gameType});
            }else {
                socket.emit('joinGame', { gameType, roomNumber, role});
            }
        }
    }, [gameType, role])


    return (
        <div>
            {role === 'host' && gameType === 'alienShooting' && <AlienShooter socket={socket} />}
            {role === 'viewer' && gameType === 'alienShooting' && <AlienViewer socket={socket} />}
            {role === 'host' && gameType === 'platformer' && <Game socket={socket} image={player.avatar}/>}
            {role === 'viewer' && gameType === 'platformer' && <Viewer socket={socket} />}
            {role === 'host' && gameType === 'RPS' && <RockPaperScissors socket={socket} />}
            {role === 'viewer' && gameType === 'RPS' && <RPSviewer socket={socket} />}
            {role === 'host' && gameType === 'bomb' && <Bomb socket={socket} />}
            {role === 'viewer' && gameType === 'bomb' && <BombViewer socket={socket} />}
        </div>
    )
}

export default Minigame;
