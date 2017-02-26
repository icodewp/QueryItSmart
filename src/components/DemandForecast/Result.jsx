import React, { Component } from 'react'
import classNames from 'classnames'
import Slider from 'material-ui/Slider'
import { deepPurple900 } from 'material-ui/styles/colors'
import { bindActionCreators } from 'redux'
import * as appActions from '../../actions/appActions'
import * as forecastActions from '../../actions/forecastActions'
import { connect } from 'react-redux'
import { WEATHERS, MONTHS, WEEKDAYS, TEMPERATURES } from '../../const'
import Circle from '../Circle'
import Restart from '../Restart'
import PopoverButton from '../PopoverButton'
import lang from '../../lang.json'

const START_HOUR = 5
const TIME_MAP = _.times(24, num => {
  if (num + START_HOUR >= 24) {
    return num - (24 - START_HOUR)
  } else {
    return num + START_HOUR
  }
})

const styles = {
  sliderBothEnds: {
    top: 0,
    bottom: 0,
    margin: 'auto 0',
    fontSize: 20,
    transform: 'translateY(-50%)',
  }
}

class Result extends Component {

  onRestart() {
    this.props.actions.restart();
    this.props.actions.forecastRestart();
  }

  onChangeSlider(e, value) {
    const { actions, forecast } = this.props
    const currentHour = TIME_MAP[value | 0]
    if (currentHour !== forecast.hour) {
      actions.changeHour(currentHour)
    }
  }

  renderTitle() {
    return (
      <div style={{
        fontSize: '6vh',
        padding: 40,
        float: 'left',
        fontWeight: 500,
      }}>
        { lang.demandForecast.header.title }
      </div>
    )    
  }
  renderSlider() {
    const { hour } = this.props.forecast
    return (
      <div className="row center-xs"
        style={{
          width: '50vw',
          position: 'absolute',
          bottom: 40,
          maxWidth: 500,
          left: 0,
          right: 0,
          margin: '0 auto',
        }}>
        <div className="col-xs-2" style={styles.sliderBothEnds}>
          <div className="box">
            Morning
          </div>
        </div>
        <div className="col-xs-8">
          <div className="box">
            <Slider
              min={0}
              max={23}
              value={_.indexOf(TIME_MAP, hour) || 0}
              style={{
              }}
              onChange={ this.onChangeSlider.bind(this) }
              />
          </div>
        </div>
        <div className="col-xs-2" style={styles.sliderBothEnds}>
          <div className="box">
            Night
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { results, sql } = this.props.forecast
    return (
      <div style={{pointerEvents: 'auto'}}>
        { this.renderTitle() }
        { this.renderSlider() }
        <Restart className="hover" labelColor="white" buttonColor={deepPurple900} onClick={this.onRestart.bind(this)} />
        <PopoverButton
          className="hover"
          labelColor="white"
          buttonColor={deepPurple900}
          textColor={deepPurple900}
          popupBackgroundColor="rgba(0, 0, 0, 0.7)"
          text={`${sql}\n\n${lang.queryExtra}`}/>
      </div>
    )
  }
}

const stateToProps = state => {
  return {
    forecast: state.forecast
  }
}

const dispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Object.assign({}, appActions, forecastActions), dispatch)
  }
}

export default connect(
  stateToProps,
  dispatchToProps,
)(Result)