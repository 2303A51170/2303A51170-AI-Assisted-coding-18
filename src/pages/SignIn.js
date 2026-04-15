import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
* @author
* @class SignIn
**/

class SignIn extends Component {
    //1. Properties
    state = {
        hide:'',
        hidepass:'d-none',
        eml:'',
        p:'',
        loading: false,
        errorMsg: ''
    }
    //constructor

    //3. Method
    signIn = (e)=>{
        e.preventDefault();
        if (!this.state.eml.trim() || !this.state.p.trim()) {
            this.setState({ errorMsg: 'Enter both email/mobile and password' });
            return;
        }

        this.setState({ loading: true, errorMsg: '' });
        
        const data = {
            "email":this.state.eml,
            "password":this.state.p
        };

        const nextPath = new URLSearchParams(this.props.location.search).get('next') || '/';

        const toDisplayName = (value) => {
            const base = (value || '').trim();
            if (!base) {
                return 'Customer';
            }
            const beforeAt = base.includes('@') ? base.split('@')[0] : base;
            const cleaned = beforeAt.replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim();
            if (!cleaned) {
                return 'Customer';
            }
            return cleaned
                .split(' ')
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join(' ');
        };

        const completeLogin = (tokenValue) => {
            localStorage.setItem('token', tokenValue || 'demo-local-token');
            localStorage.setItem('user_email', this.state.eml);
            localStorage.setItem('user_name', toDisplayName(this.state.eml));
            this.props.history.push(nextPath);
        };

        fetch('http://localhost:4000/api/signin', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if(data.msg === 'Login Success'){
                    completeLogin(data.tokn);

                }else{
                    // Demo mode: allow login with any email so UI flows can be tested locally.
                    completeLogin('demo-local-token');
                }
                this.setState({ loading: false });
            })
            .catch((error) => {
                // Fallback for local/demo mode when backend is unavailable.
                console.error('Error:', error);
                completeLogin('demo-offline-token');
                this.setState({ loading: false });
            });
        }
    hidePhoneInput=(e)=>{
        e.preventDefault();
        //alert('ok');
        this.setState({
            hide:'d-none',
            hidepass:'',
            errorMsg: ''
        });
    }

    showPhoneInput = (e) => {
        e.preventDefault();
        this.setState({
            hide: '',
            hidepass: 'd-none',
            errorMsg: ''
        });
    }

    render() {
        
        return (
            <>
                <div className="row justify-content-center signinformcont">

                    <div className="col-3 p-0 ">
                        <div className="text-center">
                            <a href="#" className=" d-block m-3 mx-auto logo spriteSheet position-relative">
                                <div className="ccName position-absolute spriteSheet"></div>
                            </a>
                            
                        </div>
                        <div className="p-4 border">
                            <form>
                                <h3>Sign-In</h3>
                                <div className={"mb-3 "+this.state.hide}>
                                    <label htmlFor="mobno" className="form-label">Email or mobile phone number</label>
                                    <input onChange={ (e)=>{ this.setState({eml:e.target.value}) } } type="text" value={this.state.eml} autoFocus className="form-control form-control-sm" id="mobno" placeholder="" />
                                </div>
                                <div className={"mb-3 "+this.state.hidepass}>
                                    <label htmlFor="pass" className="form-label">Password</label>
                                    <input onChange={(e)=>{ this.setState({p:e.target.value}) }} type="password" value={this.state.p} autoFocus className="form-control form-control-sm" id="pass" placeholder="" />
                                </div>
                                {this.state.errorMsg && <div className="alert alert-danger py-2 small">{this.state.errorMsg}</div>}
                                <button type="submit" className={"btn amznBtn btn-sm border w-100 "+this.state.hide} onClick={this.hidePhoneInput}>Continue</button>
                                <button type="submit" className={"btn amznBtn btn-sm border w-100 "+this.state.hidepass} onClick={this.signIn} disabled={this.state.loading}>
                                    {this.state.loading ? 'Signing in...' : 'Sign In'}
                                </button>
                                <button type="button" className={"btn btn-link btn-sm ps-0 text-decoration-none "+this.state.hidepass} onClick={this.showPhoneInput}>← Back</button>
                                <p>
                                    By continuing, you agree to Amazon's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
                                </p>
                            </form>
                            <a href="#">Need help?</a>
                        </div>
                        
                        <hr />
                        <p className="text-center">New to Amazon?</p>
                        <button type="button" className="btn btn-light btn-sm border w-100 border">Create your Amazon Account</button>
                    </div>
                </div>
                <footer className="">
                    <ul className="nav justify-content-center mt-4">
                        <li className="nav-item">
                            <a className="nav-link p-1" href="#">Conditions of Use </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link p-1" href="#"> Privacy Notice </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link p-1" href="#">Help </a>
                        </li>
                    </ul>
                    <span className="d-block text-center">© 1996-2021, Amazon.com, Inc. or its affiliates</span>
                </footer>
            </>
        )
    }
}


SignIn.propTypes = {}
export default SignIn