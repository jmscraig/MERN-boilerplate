import React, { Component } from 'react';
import 'whatwg-fetch';
import ReactTable from 'react-table';
//import './RoomViewer.css'
import 'react-table/react-table.css';

const extract = (str, pattern) => (str.match(pattern) || []).pop() || '';
const extractAlphanum = (str) => extract(str, "[0-9a-zA-Z]+");
const limitLength = (str, length) => str.substring(0, length);

const columns_room = [{
   Header: 'Escape Room Name',
   accessor: 'name'
}, {
   Header: 'Location ID',
   accessor: 'location_id'
}, {
   Header: 'Room ID',
   accessor: 'id'
}, {
   Header: 'Number of minutes',
   accessor: 'time_available_minutes'
}, {
   Header: 'Max Players',
   accessor: 'max_players'
}, {
   Header: 'Min Players',
   accessor: 'min_players'
}, {
   Header: 'Completion Percentage',
   accessor: 'reported_completion_percentage'
}, {
   Header: 'Difficulty',
   accessor: 'reported_difficulty'
}]

class RoomViewer extends Component {
   constructor(props) {
      super(props);

      this.state = {
         rooms: []
      };

      //this.handleChange = this.handleChange.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.newRoom = this.newRoom.bind(this);
      this.deleteRoom = this.deleteRoom.bind(this);
      this._modifyRoom = this._modifyRoom.bind(this);
   }
   
   /*
   handleChange(event) {
      this.setState({roomName: limitLength(extractAlphanum(event.target.roomName), 25)});
      this.setState({roomAddress: limitLength(extractAlphanum(event.target.roomAddress), 25)});
   }
   */

   componentDidMount() {
      fetch('/api/rooms', { method: 'GET' })
         .then(res => res.json())
         .then(json => {
            this.setState({
               rooms: json
            });
         });
   }

   newRoom() {
      fetch('/api/rooms', { method: 'POST' })
         .then(res => res.json())
         .then(json => {
            let data = this.state.rooms;
            data.push(json);

            this.setState({
               rooms: data
            });
         });
   }

   deleteRoom(index) {
      const id = this.state.rooms[index]._id;

      fetch(`/api/rooms/${id}`, { method: 'DELETE' })
         .then(_ => {
            this._modifyRoom(index, null);
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
      return (
         <div>
            <ReactTable
               data={this.state.rooms}
               columns={columns_room}
            />
            <p>Rooms:</p>

            <ul>
               { this.state.rooms.map((room, i) => (
                  <li key={i}>
                     <span>{room.name} </span>
                     <button onClick={() => this.deleteRoom(i)}>x</button>
                  </li>
               )) }
            </ul>
            <form target="_blank" method="post" action="/api/rooms">
               <input type="text" name="name" />
               <select name="location_id">
                  { this.state.roomlocations.map((roomlocation, i) => (
                     <option key={i} value={roomlocation._id}>{roomlocation.name}</option>
                  )) }
               </select>
               <input type="number" name="time_available_minutes" />
               <input type="number" name="max_players" />
               <input type="number" name="min_players" />
               <input type="number" name="reported_completion_percentage" />
               <input type="number" name="reported_difficulty" />
               <input type="submit" />
            </form>
         </div>
      );
   }
}

export default RoomViewer;
