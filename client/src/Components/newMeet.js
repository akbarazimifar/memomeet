import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Paper, Typography, TextField, Button} from '@material-ui/core';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
    root: {
        width:"94%",
        margin:"auto",
        display:"flex",
        verticalAlign:"middle",
        height:"25%"
    },
    paper: {
        margin:"auto",
        width:"80%",
        minHeight:130,
        paddingTop:"1%",
    },
    textField: {
        verticalAlign: "bottom",
        width:"25%",
    },
    Button: {
        width:"10%",
        marginTop:"4%",
        marginLeft:"3%"
    },
}));

//날짜 포맷 변환
function getFormatDate(date){
    var year = date.getFullYear();
    var month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    var day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return year + '-' + month + '-' + day;
}

export default function NewMeet(prop) {
    const classes = useStyles();
    const [selectedDate, setDate] = useState(new Date());
    const [meet_date, setMeetDate] = useState(getFormatDate(new Date()));
    const [meet_title, setMeetTitle] = useState('');
    const [meet_time, setMeetTime] = useState('');

    const handleDateChange = (date) => { 
        setDate(date); 
        setMeetDate(getFormatDate(date));
    };

    const handleSubmit=()=>{
        if(meet_title === '' || meet_time === ''){
            alert("예약할 회의 정보를 모두 입력해주세요");
        }
        else{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "group_id": prop.group_id, "meet_title":meet_title, "meet_day":meet_date, "meet_time":meet_time});

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/forwardmeet-create", requestOptions)
            .then(res => res.json())
            .then(result => {
                console.log(result);
                if (result.code === 0) {
                    alert("회의를 예약하였습니다");
                    window.location.reload();
                }
            })
            .catch(error => console.log('error', error))
        }
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    <span style={{fontWeight: "bold", textDecoration:"underline overline", textDecorationColor:"#ffc31e"}}>New Meet</span>   
                </Typography>
                <div style={{backgroundColor:"#eaeaea", width:"90%", borderRadius:10, margin:"auto", paddingBottom:"2%"}}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <TextField className={classes.textField} style={{marginRight:"2%", verticalAlign: "bottom"}} id="meet_title" label="Meet Title" value={meet_title} onChange={({ target: { value } }) => setMeetTitle(value)}/>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="yyyy/MM/dd"
                        margin="normal"
                        id="meet_day"
                        label="Meet Day"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        style={{width:"25%", marginRight:"2%", marginBottom: "0%",verticalAlign: "bottom"}}
                    />
                    <TextField
                        id="meet_time"
                        label="Meet Time"
                        type="time"
                        size="small"
                        className={classes.textField}
                        InputLabelProps={{shrink: true,}}
                        inputProps={{step: 300,}}
                        value={meet_time} onChange={({ target: { value } }) => setMeetTime(value)}
                        />
                </MuiPickersUtilsProvider>
                <Button
                        className={classes.Button}
                        height="50"
                        variant="contained"
                        color="secondary" 
                        onClick={handleSubmit}>
                        PLAN
                        </Button>
                </div>
            </Paper>
        </div>
    );
}