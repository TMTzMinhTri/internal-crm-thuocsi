import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import SearchIcon from '@material-ui/icons/Search';
import { getOrderClient } from 'client/order';
import { isValid } from 'components/global';
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import styles from './detail.module.css'

export function OrderAutoSearch(props) {
    let router = useRouter()
    const {register} = useForm();
    const [value, setValue] = useState('');
    const { error } = useToast();

    const changeURL = () => {
        router.push(`${router.pathname}?orderNo=${value}`);
    }

    const handleKeyPress = (e) => {
        if(e.keyCode == 13) {
            handleSubmit();
        }
    }
    const handleChangeValue = (e) => {
        setValue(e.target.value);
     }

     const handleSubmit = async () => {
         try {
            const orderClient = getOrderClient();
            const orderResult = await orderClient.getOrderByOrderNoFromClient(value);
            if(!isValid(orderResult)) throw new Error('Đơn hàng không tồn tại');
            changeURL();
         }
         catch(err) {
            error(err?.message || 'Đã có lỗi xảy ra');
         }

     }

    return <Box style={{ marginBottom: 12 }}>
        <TextField 
        placeholder="Nhập mã đơn hàng"
        variant="outlined"
        style={{width: '100%'}}
        inputRef={register({})}
        onKeyDown={handleKeyPress} 
        onChange={handleChangeValue} 
        InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                  <IconButton onClick={handleSubmit}>
                    <SearchIcon />
                  </IconButton>
              </InputAdornment>
            ),
            className:styles.search
          }}
  
        />
    </Box>
}