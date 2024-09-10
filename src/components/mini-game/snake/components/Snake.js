import React from 'react';

function Snake({ segments, direction, color }) {
    const getHeadRotation = () => {
        if (direction.x === 1) return 'rotate(90deg)';  // 오른쪽
        if (direction.x === -1) return 'rotate(-90deg)'; // 왼쪽
        if (direction.y === -1) return 'rotate(0deg)';   // 위쪽
        if (direction.y === 1) return 'rotate(180deg)';  // 아래쪽
        return 'rotate(0deg)';
    };

    const getSegmentPosition = (segment, index) => {
        const isHead = index === 0;
        if (isHead) {
            return {
                left: `${segment.x * 20}px`,
                top: `${segment.y * 20}px`,
            };
        }

        // 머리 밑변 중앙에 위치하도록 몸통 위치 조정
        let left = segment.x * 20;
        let top = segment.y * 20;

        if (direction.x === 1) {
            // 오른쪽으로 이동 시
            top += 10; // 아래로 10px 이동
        } else if (direction.x === -1) {
            // 왼쪽으로 이동 시
            top += 10; // 아래로 10px 이동
            left += 20; // 왼쪽에서 겹침 방지를 위해 오른쪽으로 10px 이동
        } else if (direction.y === 1) {
            // 아래로 이동 시
            left += 10; // 오른쪽으로 10px 이동
        } else if (direction.y === -1) {
            // 위로 이동 시
            left += 10; // 오른쪽으로 10px 이동
            top += 20; // 위쪽에서 겹침 방지를 위해 아래로 10px 이동
        }

        return {
            left: `${left}px`,
            top: `${top}px`,
        };
    };

    return (
        <>
            {segments.map((segment, index) => {
                const isHead = index === 0;
                return (
                    <div
                        key={index}
                        className={isHead ? "snake-head" : "snake-segment"}
                        style={{
                            ...getSegmentPosition(segment, index),
                            transform: isHead ? getHeadRotation() : 'none',
                            borderLeft: isHead ? '20px solid transparent' : '',
                            borderRight: isHead ? '20px solid transparent' : '',
                            borderBottom: isHead ? `40px solid ${color}` : '',
                            width: isHead ? '0' : '20px',
                            height: isHead ? '0' : '20px',
                            backgroundColor: !isHead ? color : '',
                        }}
                    />
                );
            })}
        </>
    );
}

export default Snake;
