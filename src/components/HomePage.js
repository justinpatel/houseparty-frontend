import React, { Component } from "react";
import JoinRoomPage from "./JoinRoomPage";
import CreateRoomPage from "./CreateRoomPage";
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from "react-router-dom";
import Room from "./Room"
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";

export default class HomePage extends Component{
    constructor(props){
        super(props);
        this.state={
            roomCode: null,
        };

        this.clearRoomCode = this.clearRoomCode.bind(this);
    }

    renderHomePage(){
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align='center'>
                    <Typography variant="h3" compact="h3" >
                        HouseParty
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                    <ButtonGroup disableElevation variant="contained" color='primary'>
                        <Button color='primary' to='/join' component={Link}>
                            Join A Room
                        </Button>
                        <Button color='secondary' to='/create' component={Link}>
                            Create A Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    async componentDidMount(){
        fetch("/api/user-in-room")
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    roomCode: data.code
                });
            });
    }

    clearRoomCode(){
        this.setState({
            roomCode: null,
        });
    }

    render(){
        return (
            
            <Router>
                    <Switch>
                        <Route exact path='/' render={() => {
                            return this.state.roomCode ? (<Redirect to={`/room/${this.state.roomCode}`} />) : this.renderHomePage();
                        }}>

                            
                        </Route>
                        <Route path='/join' component={JoinRoomPage}></Route>
                        <Route path='/create' component={CreateRoomPage}></Route>
                        <Route path='/room/:roomCode' render={(props) => {
                            return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
                        }}></Route>
                    </Switch>
            </Router>

                
        );
    }
}