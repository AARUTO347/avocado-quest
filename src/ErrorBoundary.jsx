import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('AvoQuest crashed:', error, info);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="crash">
        <h1>AVO TRIPPED OVER A ROOT</h1>
        <p>{String(this.state.error && this.state.error.message || this.state.error)}</p>
        <button className="wood primary" onClick={() => location.reload()}>RELOAD THE VILLAGE</button>
      </div>
    );
  }
}
