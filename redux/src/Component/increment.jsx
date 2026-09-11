import { useDispatch } from "react-redux";
function Increment(){
    const dispatch = useDispatch();
    return(
        <button onClick={()=>dispatch({type:"INCREMENT"})}>
            INCREMENT
        </button>
    )
}
export default Increment;