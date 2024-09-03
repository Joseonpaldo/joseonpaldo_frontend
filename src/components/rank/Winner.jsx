"use client";

import { useEffect } from "react";
import apiAxiosInstance from "@/hooks/apiAxiosInstance";

export default function Winner(props) {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    margin: '0 10px',
    textAlign: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    flex: '1',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const avatarStyle = {
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    marginBottom: '10px',
  };

  const rankStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '10px',
  };

  const [players, setPlayers] = React.useState([]);

  useEffect(() => {
    apiAxiosInstance.get(`/api/ranking/${props.type}/top3`)
      .then(response => {
        const data = response.data;
        
        const list = [];

        data.map((player, index) => { 
          list.push({
            name: player.name,
            avatar: player.profileImage,
            winrate: player.winrate
          })
        });

      setPlayers([...players, ...list]);
    })
  }, [props.type])

  return <div style={containerStyle}>
    <div style={{...cardStyle}}>
      <img
        src={`${players[1].avatar}`}
        alt={"win2"}
        style={{...avatarStyle, border: '10px solid #C0C0C0',}}
      />
      <h3>{`${players[1].name}`}</h3>
      <div style={rankStyle}>{2}</div>
    </div>

    <div style={{...cardStyle}}>
      <img
        src={`${players[0].avatar}`}
        alt={"win1"}
        style={{...avatarStyle, border: '10px solid #FFD700',}}
      />
      <h3>{`${players[0].name}`}</h3>
      <div style={rankStyle}>{1}</div>
    </div>

    <div style={{...cardStyle}}>
      <img
        src={`${players[2].avatar}`}
        alt={"win3"}
        style={{...avatarStyle, border: '10px solid #cd7f32',}}
      />
      <h3>{`${players[2].name}`}</h3>
      <div style={rankStyle}>{3}</div>
    </div>
  </div>
}
