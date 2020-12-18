Exmaple:


```
    const RenderFilter = (expand) => (
        <form>
            <ExpansionPanel defaultExpanded={expand.expand} style={{marginBottom:'1%'}}>
                <ExpansionPanelSummary>
                    {/* <Grid container spacing={2} direction="row"
                        justify="space-evenly"
                        alignItems="center"
                    >
                        
                    </Grid> */}
                    <p>Filter result: category: ABC, Name is XYZ</p>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={styles.details}>
                    <Grid container spacing={2} direction="row"
                            justify="space-evenly"
                            alignItems="center"
                        >
                        <Grid item xs={4} sm={6} md={4}>
                            <FormControl className={styles.formControl} style={{width: '100%', margin: '-10px'}}>
                                <InputLabel id="category-select-label" style={{marginLeft: '5%'}}>Loại sản phẩm</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    id="category"
                                    name="category"
                                    variant="outlined"
                                >
                                    
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} sm={6} md={4}>
                            <FormControl className={styles.formControl} style={{width: '100%', margin: '-10px'}}>
                                <InputLabel id="category-select-label" style={{marginLeft: '5%'}}>Loại sản phẩm</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    id="category"
                                    name="category"
                                    variant="outlined"
                                    margin="normal"
                                >
                                    
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} sm={6} md={4}>
                            <FormControl className={styles.formControl} style={{width: '100%', margin: '-10px'}}>
                                <TextField
                                    id="volume"
                                    name="volume"
                                    label="Thể tích"
                                    placeholder=""
                                    helperText="Ví dụ: 4 chai x 300ml"
                                    
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{width: '100%', marginTop: '20px' }}
                                    required
                                    inputRef={
                                        register({
                                            required: "Volume Required",
                                        })
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} sm={6} md={4}>
                            <FormControl className={styles.formControl} style={{width: '100%', margin: '-10px'}}>
                                <InputLabel id="category-select-label" style={{marginLeft: '5%'}}>Loại sản phẩm</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    id="category"
                                    name="category"
                                >
                                    
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} sm={6} md={4}>
                            <FormControl className={styles.formControl} style={{width: '100%', margin: '-10px'}}>
                                <InputLabel id="category-select-label" style={{marginLeft: '5%'}}>Loại sản phẩm</InputLabel>
                                    <Controller 
                                        name="unit"
                                        control={control}
                                       
                                        as={
                                            <Select label="unit" variant="outlined">
                                                
                                            </Select>
                                        }
                                    />
                                </FormControl>
                        </Grid>
                        <Grid item xs={4} sm={4} md={4}></Grid>
                    </Grid>
                    
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                    <Button size="small" onClick={() => {setOpen(false)}}>Đóng</Button>
                    <Button size="small" color="primary">
                        Tìm kiếm
                    </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        </form>
    )
```