import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { config } from '../App';
import { useSnackbar } from 'notistack'
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,

};

export default function BasicModal({ trigger, setTrigger }) {

    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = useState(false);
    const [titleValue, setTitleValue] = useState("");
    const [descriptionValue, setDescriptionValue] = useState("");
    const [dateState, setDateState] = useState();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDateChange = (event) => {
        setDateState(event.target.value);
    }
    const handleDescriptionChange = (event) => {
        setDescriptionValue(event.target.value);
    }
    const handleTitleChange = (event) => {
        setTitleValue(event.target.value)
    }
    // console.log(titleValue)
    // console.log(descriptionValue)
    // console.log(dateState)


    let body = {
        title: titleValue,
        description: descriptionValue,
        dueDate: dateState
    }

    const uploadTaskToDatabase = (event) => {
        const api = `${config.endpoint}tasks`
        axios.post(api, body)
            .then((res) => {
                enqueueSnackbar("Task uploaded successfully", { variant: "success" })
                handleClose();
                setTrigger(!trigger)
                // console.log(res.data.videos)
            })
            .catch((err) => {
                // console.log(err.response.data.error[0].message);
                enqueueSnackbar(err.response.data.error[0].message, { variant: "error" })
            })
    }


    return (
        <div>
            <Button color="warning" variant="contained" onClick={handleOpen}>Add Task</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{display:"flex", justifyContent:"space-between"}} >
                        <Typography sx={{ color: "#ed6c02" }} gutterBottom >
                            Add new Task details here!
                        </Typography>
                        <CloseIcon onClick={handleClose} />
                    </Box>

                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '100%' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField onChange={handleTitleChange} id="outlined-basic" label="Title" variant="outlined" />
                        <TextField onChange={handleDescriptionChange} id="outlined-basic" label="Description" variant="outlined" />
                        <TextField
                            required
                            id="outlined-basic"
                            variant="outlined"
                            sx={{ marginTop: 2 }}
                            helperText="Add Due Date"
                            onChange={handleDateChange}
                            type='date'
                        />
                    </Box>
                    <Button sx={{ marginTop: 2 }} color="warning" variant="contained" onClick={uploadTaskToDatabase}>Add Task</Button>
                </Box>
            </Modal>
        </div>
    );
}