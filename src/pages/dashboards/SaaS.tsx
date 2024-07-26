import {Box} from "@mui/material";
import useTitle from "hooks/useTitle";
import {FC} from "react";
import YutPan from "../../components/game/YutPan";
import ChatComponent from "../../components/game/chatComponent";
import {useParams} from "react-router";

const SaaS: FC = () => {
    const params = useParams();
    console.log(params);
    // change navbar title
    useTitle("In Game");
    console.log("SaaS render");
    window.onload =  () => {

    }
    return (
        <Box>
            <YutPan/>
            <ChatComponent/>
        </Box>
    );
};

export default SaaS;
