import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function PlayerList({ players }) {
    // 점수 순으로 플레이어 정렬
    const sortedPlayers = Object.values(players).sort((a, b) => b.score - a.score);

    return (
        <div className="player-list">
            <h2>Players</h2>
            <TransitionGroup component="ul">
                {sortedPlayers.map((player, index) => (
                    <CSSTransition key={player.id} timeout={500} classNames="player-item">
                        <li className={player.alive ? 'alive' : 'dead'}>
                            <div className="player-info">
                                {/* 랭킹 */}
                                <span>{`${index + 1}위:`}</span>&nbsp;&nbsp;
                                {/* 플레이어 마크 */}
                                <span
                                    className="color-mark"
                                    style={{
                                        borderColor: `transparent transparent ${player.color} transparent`
                                    }}
                                ></span>
                                {/* 플레이어 이름 */}
                                <span>{player.id}</span>
                            </div>
                            <div className="player-score">
                                <span>Score: {player.score}</span>
                            </div>
                            {player.alive ? ' - Alive' : ' - Dead'}
                        </li>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    );
}

export default PlayerList;
