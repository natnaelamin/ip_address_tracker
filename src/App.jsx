import { MapContainer, TileLayer} from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import { FaGreaterThan } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import MarkerPosition from './MarkerPosition';


function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/
  

useEffect(() => {
 try {
   const getInitialData = async () =>{
    const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_nvGWSh6Vt1YQU6OzxwbwkSx0WwBbn&ipAddress=192.212.174.101`);
    const data = await res.json()
    setAddress(data)
   }
   getInitialData()
 } catch (error) {
  console.trace(error)

 }
}, [])

async function getAddress(){
  const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_nvGWSh6Vt1YQU6OzxwbwkSx0WwBbn&${
      checkIpAddress.test(ipAddress) ?  `ipAddress=${ipAddress}` :
       checkDomain.test(ipAddress) ? `domain=${ipAddress}` : ""
    }`);
    const data = await res.json()
    setAddress(data)
}

function handleSubmit(e){
  e.preventDefault()
  getAddress()
  setIpAddress("")
}

  return (
    <div className="relative ">
      <img className='w-full h-[300px]'
        src="/images/pattern-bg-desktop.png"
        alt="bg-image"
      />
      <div className="absolute grid place-items-center gap-10 top-5 w-full">
        <h1 className="text-3xl md:text-4xl text-white font-semibold">IP Address Tracker</h1>
        <form onSubmit={handleSubmit} className="flex">
          <input type="text"
          name='ipaddress'
          id='ipaddress'
          autoComplete='off'
          required 
          className="rounded-l-lg md:rounded-l-xl w-full md:w-[500px] h-12 px-2 md:px-5 text-md md:text-lg" 
          placeholder="Search for any ip address or domain"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}/>
          <button type="submit" 
          className="text-white bg-black rounded-r-lg md:rounded-r-xl w-10 flex items-center justify-center">
          <FaGreaterThan/>
          </button>
        </form>
      </div>
      {address && 
      <>
        <div className="absolute top-[230px] w-full h-full px-5 md:h-[150px] flex justify-center items-center z-10">
          <div className="grid md:grid-cols-4 md:place-items-center w-full md:w-[1000px] h-full bg-white  px-10 rounded-xl">
            <div className="grid gap-4 md:border-r border-r-slate-500 pr-14 h-14 md:h-20">
              <h4 className="text-zinc-500 font-semibold text-sm">IP ADDRESS</h4>
              <h1 className="font-bold text-lg md:text-xl">{address.ip}</h1>
            </div>
            <div className="grid gap-1 md:border-r border-r-slate-500 pr-14 h-14 md:h-20">
              <h4 className="text-zinc-500 font-semibold text-sm">LOCATION</h4>
              <h1 className="font-bold text-lg md:text-xl">{address.location.city}, {address.location.region}</h1>
            </div>
            <div className="grid gap-1 md:border-r border-r-slate-500 pr-14 h-14 md:h-20">
              <h4 className="text-zinc-500 font-semibold text-sm">TIME ZONE</h4>
              <h1 className="font-bold text-lg md:text-xl">UTC {address.location.timezone}</h1>
            </div>
            <div className="grid gap-1 pr-14 h-14 md:h-20">
              <h4 className="text-zinc-500 font-semibold text-sm">ISP</h4>
              <h1 className="font-bold text-lg md:text-xl">{address.isp}</h1>
            </div>
          </div>
        </div>
        <div className='relative z-0'>
          <MapContainer center={[address.location.lat, address.location.lng]} zoom={13} scrollWheelZoom={true}
          style={{height: "500px", width:"100vw"}}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerPosition address={address}/>
          </MapContainer>
        </div>
      </>}
    </div>
  )
}

export default App
