import {FormControl, InputLabel, Select, SelectProps, styled} from "@mui/material";
import React from "react";
import {useTheme} from "@mui/material/styles";



const StyledSelect = styled(Select)<SelectProps>(({theme}) => ({
    "& .MuiOutlinedInput-input": {
        fontWeight: 500,
        color: theme.palette.text.primary,
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderRadius: "8px",
        border: "2px solid",
        borderColor:
            theme.palette.mode === "light"
                ? theme.palette.secondary[300]
                : theme.palette.divider,
    },
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.secondary[300],
    },
}));

const LightSelect = (props: SelectProps) => {
    const theme = useTheme(); // 테마 가져오기

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel sx={{color: theme.palette.secondary[400]}}>
                {props.label}
            </InputLabel>
            <StyledSelect
                {...props}
                label={props.label}
            />
        </FormControl>
    );
};

export default LightSelect;
