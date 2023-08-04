import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, Typography } from '@mui/material';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import BasicModal from './BasicModal';
import TextField from '@mui/material/TextField';
import { config } from '../App';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import Slider from '@mui/material/Slider';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: theme.spacing(1),
    textAlign: 'center',
}));

export default function Home() {
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMdScreen = useMediaQuery(theme.breakpoints.up('md'));

    const [tasks, setTasks] = useState([]);
    const [trigger, setTrigger] = useState(false);
    const [showTextField, setShowTextField] = useState(false);
    const [description, setDescription] = useState('');
    const [timerID, setTimerId] = useState('');
    const debouncingValue = 0;

    // Use an object to store the states for each task
    const [taskStates, setTaskStates] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const api = `${config.endpoint}tasks`;

            try {
                const response = await axios.get(api);
                setTasks(response.data.tasks);

                // Initialize taskStates with initial values based on fetched tasks
                const initialTaskStates = {};
                response.data.tasks.forEach((task) => {
                    initialTaskStates[task._id] = {
                        showTextField: false,
                        slider: task.progress || 0,
                    };
                });
                setTaskStates(initialTaskStates);
            } catch (error) {
                enqueueSnackbar(error.response.data.error[0].message, { variant: 'error' });
            }
        };

        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger]);

    const editTask = (event) => {
        const taskId = event.currentTarget.value;
        // Create a copy of the current task states object
        const newTaskStates = { ...taskStates };
        // Set the 'showTextField' state to true for the clicked task
        newTaskStates[taskId] = { ...newTaskStates[taskId], showTextField: true };
        setTaskStates(newTaskStates);
    };

    const descriptionChangeHandle = (event) => {
        setDescription(event.target.value);
    };

    const handleSliderValue = (event) => {
        const taskId = event.target.name;
        const value = event.target.value;

        // Clear any existing timer for this task
        timerID && clearTimeout(timerID);

        // Set the 'slider' state for the clicked task and create a new timer
        const newTimerID = setTimeout(async () => {
            const api = `${config.endpoint}tasks`;
            await axios
                .patch(api, { _id: taskId, progress: value })
                .then(() => {
                    setTrigger(!trigger);
                })
                .catch((error) => {
                    console.error(error);
                });
        }, debouncingValue);

        setTimerId(newTimerID);

        // Create a copy of the current task states object
        const newTaskStates = { ...taskStates };
        // Set the 'slider' state for the clicked task
        newTaskStates[taskId] = { ...newTaskStates[taskId], slider: value };
        setTaskStates(newTaskStates);
    };

    const deleteTask = async (event) => {
        const taskId = event.currentTarget.value;

        const api = `${config.endpoint}tasks/${taskId}`;
        try {
            await axios.delete(api);
            enqueueSnackbar('Successfully deleted', { variant: 'success' });
            setTrigger(!trigger);
        } catch (error) {
            enqueueSnackbar('Something went wrong, could not be deleted', { variant: 'error' });
        }
    };

    const save = async (event) => {
        const taskId = event.target.name;
        try {
            const api = `${config.endpoint}tasks`;
            await axios
                .patch(api, { _id: taskId, description: description })
                .then(() => {
                    setTrigger(!trigger);
                    setShowTextField(false);
                    enqueueSnackbar('Edited successfully', { variant: 'success' });
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const closeEdit = (taskId) => {
        // Create a copy of the current task states object
        const newTaskStates = { ...taskStates };
        // Set the 'showTextField' state to false for the clicked task
        newTaskStates[taskId] = { ...newTaskStates[taskId], showTextField: false };
        setTaskStates(newTaskStates);
    };

    console.log(showTextField)

    return (
        <Box sx={{ backgroundImage: 'linear-gradient(135deg, #153677, #4e085f)', height: '70rem' }}>
            <Box sx={{ position: 'absolute', background: 'white', top: '25%', left: '20%', borderRadius: '10px', padding: '25px', width: '55%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant={isMdScreen ? "button" : "overline"} gutterBottom>
                        Task Management Application{' '}
                        <span style={{ position: "relative", top: 7 }}>
                            <AutoStoriesOutlinedIcon color="warning" />
                        </span>
                    </Typography>
                    <BasicModal trigger={trigger} setTrigger={setTrigger} />
                </Box>
                <Box sx={{ flexGrow: 1, marginTop: 2 }}>
                    <Grid container rowSpacing={2}>
                        {
                            (tasks.length !== 0) ?
                                tasks.map((value, key) => (
                                    <Grid item xs={12} sm={12} lg={12} key={value._id}>
                                        <Item index={value._id}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="button" sx={{ fontFamily: "'Inter var',sans-serif" }} gutterBottom>
                                                    {value.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Button onClick={editTask} value={value._id}>
                                                        <BorderColorOutlinedIcon style={{ color: 'blue' }} />
                                                    </Button>
                                                    <Button onClick={deleteTask} value={value._id}>
                                                        <DeleteOutlineOutlinedIcon sx={{ color: 'red' }} />
                                                    </Button>
                                                </Box>
                                            </Box>
                                            <Box className="hiddenClassName" sx={{ display: taskStates[value._id]?.showTextField ? 'none' : 'block', textAlign: 'left' }}>
                                                <Typography variant="overline" sx={{ textTransform: 'none', fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.43, letterSpacing: '0.01071em', color: 'rgba(0, 0, 0, 0.6)' }}>
                                                    {value.description}
                                                </Typography>
                                            </Box>
                                            <Box style={{ display: taskStates[value._id]?.showTextField ? 'block' : 'none', textAlign: 'left', marginLeft: 2 }}>
                                                <TextField id="standard-multiline-static" placeholder="edit description here" multiline rows={2} value={description} onChange={descriptionChangeHandle} variant="standard" name={value._id} fullWidth />
                                                <Button variant="outlined" onClick={save} name={value._id} sx={{ marginTop: 2 }}>
                                                    Save
                                                </Button>
                                                <Button variant="outlined" onClick={() => closeEdit(value._id)} sx={{ marginLeft: 2, marginTop: 2 }}>
                                                    Cancel
                                                </Button>
                                            </Box>
                                            <Box maxWidth={300} sx={{ marginTop: 2, marginLeft: 2 }}>
                                                <Slider size="small" value={taskStates[value._id]?.slider || 0} onChange={handleSliderValue} name={value._id} aria-label="Small" valueLabelDisplay="auto" min={0} max={100} />
                                                <Typography sx={{ textAlign: 'left' }} gutterBottom>
                                                    status :{' '}
                                                    {value.status === 'toDo' ? (
                                                        <span style={{ color: 'red' }}>{value.status}</span>
                                                    ) : value.status === 'inprogress' ? (
                                                        <span style={{ color: 'blue' }}>{value.status}</span>
                                                    ) : value.status === 'almost-completed' ? (
                                                        <span style={{ color: 'orange' }}>{value.status}</span>
                                                    ) : value.status === 'completed' ? (
                                                        <span style={{ color: 'green' }}>{value.status}</span>
                                                    ) : (
                                                        <span>{value.status}</span>
                                                    )}
                                                </Typography>
                                                <Typography  gutterBottom>

                                                </Typography>
                                            </Box>
                                        </Item>
                                    </Grid>
                                ))
                                :
                                <Grid item xs={12} sm={12} lg={12} >
                                    <Item>
                                        <Typography variant='overline' gutterbottom>
                                            No tasks found!, add one to view here <span>&#128516;</span>.
                                        </Typography>
                                    </Item>
                                </Grid>
                        }
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}
