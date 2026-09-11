
import { useSelector } from "react-redux"
import Increment from "./Component/increment";
import Decrement from "./Component/decrement";
function App() {
const count = useSelector((state)=>state.count);
  return (
    <>
     <div>
      <h1>count:{count}</h1>
      <Increment/>
      <Decrement/>
     </div>
    </>
  )
}

export default App
