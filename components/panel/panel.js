import {
    Button,
    Divider,
    ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails
} from "@material-ui/core";
import styles from "./panel.module.css";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
/*
    Input: children: pages component
           expand:bool - collapse default open or close
           setOpen:function setState - function set varible expand
           setExecute:function - function call onClick button submit
*/
const PanelCollapse = ({
                children,
                expand,
                setOpen,
                setExecute
    }) => {
    // TODO

    function fnExecute(formData) {
        setExecute(formData)
    }

    return (
        <div>
            <form>
                <ExpansionPanel defaultExpanded={expand}>
                     <ExpansionPanelSummary>
                        <b>Bảng tìm kiếm</b>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {children}
                    </ExpansionPanelDetails>
                    <Divider />
                    <ExpansionPanelActions>
                        <Button size="small" onClick={() => {setOpen(!expand)}}>Đóng</Button>
                        <Button size="small" color="primary" onClick={fnExecute}>
                            Tìm kiếm
                        </Button>
                    </ExpansionPanelActions>
                </ExpansionPanel>
            </form>
        </div>
    )
}

export default PanelCollapse;