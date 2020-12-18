import {
    Checkbox, FormControl,
    FormControlLabel,
    FormLabel
} from "@material-ui/core";
import ModalCustom from "components/modal/dialogs";
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

function FormAddCondition(
                open,
                options,
                callback,
                onlose,
                conditions,
            ){
    const { handleSubmit, errors, control, getValues } = useForm({ mode: 'onChange' });
    
    // You can set default checkbox with set useState(array values)
    const [checkedValues, setCheckedValues] = useState([]);
   
    
    useEffect(() => {
        setCheckedValues([])
    }, [])

    function handleSelect(checkedId) {
        const newIds = checkedValues?.includes(checkedId)
          ? checkedValues?.filter(name => name !== checkedId)
          : [...(checkedValues ?? []), checkedId];
        setCheckedValues(newIds);
        return newIds;
      }

    function fnModalExcute(){
        onlose(false)
        setCheckedValues([])
        callback(getValues().item_ids)  
    }

    return (
        <ModalCustom
            open={open} 
            onClose={onlose} 
            title="Thêm điều kiện cài đặt" 
            primaryText="Thêm" 
            onExcute={fnModalExcute}
        >
            <form onSubmit={handleSubmit(data => console.log("DATA --->", data))}>
            <FormControl error={!!errors.item_ids?.message}>
                <FormLabel component="legend">Vui lòng chọn loại điều kiện muốn cài đặt thêm</FormLabel>
                <Controller
                    name="item_ids"
                    render={props =>
                        options.filter((item) => conditions.includes(item.value) === false).map((item, index) => (
                        <FormControlLabel
                            control={
                            <Checkbox
                                onChange={() => props.onChange(handleSelect(item.value))}
                                checked={checkedValues.includes(item.value)}
                            />
                            }
                            key={item.value}
                            label={item.label}
                        />
                        ))
                    }
                    control={control}
                    />
            </FormControl>
            {/* <pre>SELECTED: {JSON.stringify(getValues(), null, 2)}</pre> */}
            </form>
        </ModalCustom>
    )
}

export default FormAddCondition;