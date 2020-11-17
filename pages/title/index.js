import AppCMS from "pages/_layout";
import { Component } from "react";

export default class TitlePage extends Component {
    render() {
        return <AppCMS select="/title"> This is title page. Hello world hello yyy</AppCMS>
    }
}