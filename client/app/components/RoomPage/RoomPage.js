import React, { Component } from 'react';
import 'whatwg-fetch';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withRouter, Link } from 'react-router-dom';

class RoomPage extends Component {
   constructor(props) {
      super(props);

      this.state = {
         currentRoom: {},
         rooms: [],
         roomcompanies: [],
         roomlocations: []
      };

      //this.handleChange = this.handleChange.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.incrementRating = this.incrementRating.bind(this);
      this._modifyRoom = this._modifyRoom.bind(this);
   }
   
   /*
   handleChange(event) {
      this.setState({roomName: limitLength(extractAlphanum(event.target.roomName), 25)});
      this.setState({roomAddress: limitLength(extractAlphanum(event.target.roomAddress), 25)});
   }
   */

   componentDidMount() {

      //const { match: { params } } = this.props;
      //const { id } = this.props.match.params
      
      /*
      const {id} = this.props.match.params

      app.get('/api/rooms/${params.id}')
         .then(({ currentRoom }) => {
            console.log('currentRoom', currentRoom);
            this.setState({ currentRoom });
         });*/
         
      fetch('/api/rooms', { method: 'GET' })
         .then(res => res.json())
         .then(json => {
            this.setState({
               rooms: json
            });
         });
         
      fetch('/api/roomlocations', { method: 'GET' })
         .then(res => res.json())
         .then(json => {
            this.setState({
               roomlocations: json
            });
         });
         
      fetch('/api/roomcompanies', { method: 'GET' })
         .then(res => res.json())
         .then(json => {
            this.setState({
               roomcompanies: json
            });
         });
         
      fetch('/api/rooms/'+this.props.match.params.id, { method: 'GET' })
         .then(res => res.json())
         .then(json => {
            this.setState({
               currentRoom: json.data
            });
         });
    
   }
   
   incrementRating(index) {
      const id = this.state.rooms[index]._id;

      fetch(`/api/rooms/${id}/increment`, { method: 'PUT' })
         .then(res => res.json())
         .then(json => {
            this._modifyRoom(index, json);
         });
   }
   
   _modifyRoom(index, data) {
      let prevData = this.state.rooms;

      if (data) {
         prevData[index] = data;
      } else {
         prevData.splice(index, 1);
      }

      this.setState({
         rooms: prevData
      });
   }

   render() {
      const {match} = this.props
      const id_test = match.params.id
      const filter_room = this.state.rooms.filter(room => room._id == id_test)
      var location_id = filter_room.map(room => room.location_id)
      const filter_location = this.state.roomlocations.filter(roomloc => roomloc._id == location_id)
      //var company_id = filter_location.map(roomloc => roomloc.company_id)
      //const filter_company = this.state.roomcompanies.filter(roomcomp => roomcomp._id == company_id)

      return (
         <div>
            <p>Rating:</p>

               <ul>
                  { this.state.rooms.map((room, i) => (
                     <li key={i}>
                        <span>{room.count} </span>
                        <button onClick={() => this.incrementRating(i)}>+</button>
                     </li>
                  )) }
               </ul>
            <h1>Room:</h1>

            <ul>
               { filter_room.map((room, i) => (
                  <div key={i}>
                     <li>Name: {room.name}</li>
                     <li>Location ID: {room.location_id}</li>
                     <li>Time Available: {room.time_available_minutes} minutes</li>
                     <li>Players: {room.min_players} - {room.max_players} players</li>
                     <li>Completion Percentage: {room.reported_completion_percentage}</li>
                     <li>Difficulty: {room.reported_difficulty}</li>
                     <li>Price: {room.price}</li>
                     <li>Room Information: <Link target="_blank" to={{ pathname: room.room_URL}}>{room.room_URL}</Link></li>
                     <li>Notes: {room.notes}</li>
                     <img src={room.image_URL} alt="Room Header Image"/>
                  </div>
               )) }
            </ul>
            <h1>Location:</h1>
            <span>{location_id}</span>
            <ul>
               { filter_location.map((roomloc, i) => (
                  <div key={i}>
                     <li>Name: {roomloc.name}</li>
                     <li>Company ID: {roomloc.company_id}</li>
                     <li>Address ID: {roomloc.address_id}</li>
                     <li>Website: <Link target="_blank" to={{ pathname: roomloc.website}}>{roomloc.website}</Link></li>
                     <li>Booking URL: <Link target="_blank" to={{ pathname: roomloc.booking_URL}}>{roomloc.booking_URL}</Link></li>
                     <li>Address: {roomloc.address}</li>
                     <li>Telephone: {roomloc.tel}</li>
                     <li>Email: {roomloc.email}</li>
                  </div>
               )) }
            </ul>
         </div>
      );
   }
}

export default withRouter(RoomPage)
