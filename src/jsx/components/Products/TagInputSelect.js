import React, { useState } from "react";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.

const TagInputSelect = (props) => {
  const [state, setState] = useState({ tags: [] });
  const [item, setItem] = useState(props.item);
  
  const handleChange = (tags) => {
    setState({ tags })
    // console.log(state);

    // if(item===props.item ){
      props.setfunction([...props.arr, tags])
      console.log(state);
    // }else{
    //   console.log("tet");
    // }
    // props.arr?.map((value)=>{

    //   props.setOptionfunction(value)

    // })
    setItem(props.item)

  }
  return (
    <TagsInput  onlyUnique={true}  value={state.tags} onChange={handleChange} />
  );
};

export default TagInputSelect;
