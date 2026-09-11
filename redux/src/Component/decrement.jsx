import { useDispatch } from "react-redux";
function Decrement(){
    const dispatch = useDispatch();
    return(
        <button onClick={()=>dispatch({type:"DECREMENT"})}>Decrement</button>
    )
}
export default Decrement;