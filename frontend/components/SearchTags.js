import {  useState, createContext, useMemo, useCallback  } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import '../style/tags.css';

import ReactDOM from 'react-dom';

const KeyCodes = {
  COMMA: 188,
  ENTER: 13,
  TAB: 9,
};

const delimiters = [KeyCodes.COMMA, KeyCodes.ENTER, KeyCodes.TAB];
// const TagApi = createContext(null);
// const TagFunctionApi =createContext(null);

export const Tags = ({ tags,setTags }) =>{
  const [ suggestions, setSuggestions ] = useState( [
      { id: 'Montreal', text: 'Montreal' },
      { id: 'Sherbrooke', text: 'Sherbrooke' },
    ]
  );

  const handleDelete = useCallback((i) =>
    setTags(tags.filter((tag, index) => index !== i)), [tags]);
  
  const handleAddition = useCallback((tag) => 
    setTags([...tags, tag]), [tags]);

  const handleDrag= useCallback((tag, currPos, newPos) =>{
      const newTags = tags.slice();
      newTags.splice(currPos, 1);
      newTags.splice(newPos, 0, tag);
      setTags(newTags);
      // re-render
  }, [tags]);
  
  return (
    <div>        
      {/* <TagApi.Provider value={getApi}> */}
        <ReactTags 
          inlinputFieldPosition="inline"ine 
          tags={tags}
          suggestions={suggestions}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          delimiters={delimiters} />
      {/* </TagApi.Provider> */}
    </div>
    
  );
}
