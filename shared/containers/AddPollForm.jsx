import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import * as Actions from '../redux/actions/actions';

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  if (!values.title) {
    errors.title = 'Required';
  }
  if (!values.options) {
    errors.options = 'Required';
  } else if (!values.options.match(/.,./)) {
    errors.options = 'At least two options separated by a comma are required';
  }
  return errors;
};

class AddPollForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }
  submit(e) {
    e.preventDefault();
    const { fields: { name, title, options } } = this.props;
    const poll = {
      name: name.value,
      title: title.value,
      options: options.value.split(',').map(optionI => ({ option: optionI.trim() }))
    };
    this.props.dispatch(Actions.addPollRequest(poll));
    this.props.dispatch(Actions.showModal(false));
  }
  render() {
    const { fields: { name, title, options } } = this.props;
    return (
      <form onSubmit={this.submit}>
        <div className={`form-group ${name.touched && name.error ? 'has-error' : ''}`}>
          <label className="control-label">Name later replaced by login?</label>
          <input type="text" className="form-control" placeholder="Fiona Staples"{...name} />
          {name.touched && name.error && <div className="help-block">{name.error}</div>}
        </div>
        <div className={`form-group ${title.touched && title.error ? 'has-error' : ''}`}>
          <label className="control-label">Poll Title</label>
          <input type="text" className="form-control" placeholder="Favorite Character"{...title} />
          {title.touched && title.error && <div className="help-block">{title.error}</div>}
        </div>
        <div className={`form-group ${options.touched && options.error ? 'has-error' : ''}`}>
          <label className="control-label">Poll Options (separated by comma)</label>
          <textarea
            className="form-control" rows="5" placeholder="Alana, Marko, Hazel" {...options}
          />
          {options.touched && options.error && <div className="help-block">{options.error}</div>}
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    );
  }
}

AddPollForm.propTypes = {
  dispatch: PropTypes.func,
  fields: PropTypes.object
};

AddPollForm = reduxForm({ // eslint-disable-line
  form: 'addPoll',
  fields: ['name', 'title', 'options'],
  validate
})(AddPollForm);

export default AddPollForm;
