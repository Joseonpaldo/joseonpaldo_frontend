import {Button, Grid, MenuItem} from "@mui/material";
import LightTextField from "components/LightTextField";
import {useFormik} from "formik";
import useTitle from "hooks/useTitle";
import React, {FC} from "react";
import * as Yup from "yup";
import LightSelect from "../../components/LightSelect";
import {Box} from "@mui/system";

// styled components

const AddNewUser: FC = () => {
    // change navbar title
    useTitle("방 만들기");

    const initialValues = {
        roomName: "",
        totPlayer: "",
        startBudget: "",
    };

    const validationSchema = Yup.object().shape({
        roomName: Yup.string().required("방 이름은 필수 입력 사항입니다!"),
        totPlayer: Yup.number().required("Name is Required!"),
        startBudget: Yup.number().required("Name is Required!"),
    });

    const {values, errors, handleChange, handleSubmit, touched, setFieldValue} = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {
            console.log(values); // 제출된 값 출력

        },
    });

    return (
        <Grid>
            <Box sx={{padding: "30px", backgroundColor: "white"}}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item sm={12} xs={12}>
                            <LightTextField
                                fullWidth
                                name="roomName"
                                label="방 이름"
                                value={values.roomName}
                                onChange={handleChange}
                                error={Boolean(touched.roomName && errors.roomName)}
                                helperText={touched.roomName && errors.roomName}
                            />
                        </Grid>

                        <Grid item sm={6} xs={12}>
                            <LightSelect
                                fullWidth
                                label="최대 인원 수"
                                name="totPlayer"
                                value={values.totPlayer}
                                onChange={(event) => setFieldValue("totPlayer", event.target.value)} // 수정된 부분
                                error={Boolean(touched.totPlayer && errors.totPlayer)}
                            >
                                <MenuItem value={2}>2명</MenuItem>
                                <MenuItem value={4}>4명</MenuItem>
                            </LightSelect>
                        </Grid>

                        <Grid item sm={6} xs={12}>
                            <LightSelect
                                fullWidth
                                label="초기 자금"
                                name="startBudget"
                                value={values.startBudget}
                                onChange={(event) => setFieldValue("startBudget", event.target.value)} // 수정된 부분
                                error={Boolean(touched.startBudget && errors.startBudget)}
                            >
                                <MenuItem value={5000000}>500만 냥</MenuItem>
                                <MenuItem value={10000000}>1000만 냥</MenuItem>
                                <MenuItem value={15000000}>1500만 냥</MenuItem>
                            </LightSelect>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained">
                                방 생성
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Grid>
    );
};

export default AddNewUser;
