import React, { Component } from "react";
import { render } from "react-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default class Room extends Component{
    constructor(props){
        super(props);
        this.state ={
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuthenticated: false,
            song: {}
        };
        this.roomCode = this.props.match.params.roomCode;

        this.getRoomDetails();
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
    }

    componentDidMount(){
        this.interval = setInterval(this.getCurrentSong, 1000)
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    updateShowSettings(value){
        this.setState({
            showSettings: value,
        })
        //this.getRoomDetails();
    }

    renderSettingsButton(){
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => this.updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    renderSettings(){
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage 
                        update={true} 
                        votesToSkip={this.state.votesToSkip}
                        guestCanPause={this.state.guestCanPause} 
                        roomCode={this.roomCode} 
                        updateCallback={this.getRoomDetails}>

                    </CreateRoomPage>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => this.updateShowSettings(false)}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    }


    getRoomDetails(){
        fetch("https://houseparty123.herokuapp.com/api/get-room?code=" + this.roomCode)
            .then((response) => {
                if(!response.ok){
                    this.props.leaveRoomCallback();
                    this.props.history.push("/");
                }
                return response.json()
            })
            .then((data) => {
                this.setState({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                });
                if (this.state.isHost){
                    this.authenticateSpotify();
                }
            });

    }

    authenticateSpotify(){
        fetch('https://houseparty123.herokuapp.com/spotify/is-authenticated')
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    spotifyAuthenticated: data.status
                });
                if (!data.status){
                    fetch('https://houseparty123.herokuapp.com/spotify/get-auth-url')
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                }
            });
    }

    getCurrentSong(){
        fetch('https://houseparty123.herokuapp.com/spotify/current-song')
            .then((response) => {
                if(!response.ok){
                    return {};
                }else{
                    return response.json();
                }
            }).then((data) => {
                this.setState({
                    song: data
                });
                // console.log(data)
            });
    }

    leaveButtonPressed(){
        const requestOptions={
            method: "POST",
            headres: {"Content-Type":"application/json"},
        };

        fetch('https://houseparty123.herokuapp.com/api/leave-room', requestOptions)
            .then((response) => {
                this.props.leaveRoomCallback();
                this.props.history.push('/');
            });
    }

    render(){
        if (this.state.showSettings){
            return this.renderSettings();
        }
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <Typography variant='h4' component='h4'>
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer {...this.state.song}/>
                {this.state.isHost ? this.renderSettingsButton() : null}
                <Grid item xs={12} align='center'>
                    <Button color='secondary' variant='contained' onClick={this.leaveButtonPressed}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        );
    }
}
