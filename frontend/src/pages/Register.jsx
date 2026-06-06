import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../../public/assets/css/Auth.module.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.first_name = 'First name is required.';
    if (!lastName.trim()) newErrors.last_name = 'Last name is required.';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Please enter a valid email address.';
    if (!password || password.length < 8)
      newErrors.password = 'Password must be at least 8 characters.';
    if (!/(?=.*[A-Z])(?=.*\d)/.test(password))
      newErrors.password = 'Password needs at least 1 uppercase letter and 1 number.';
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
    if (!agreeToTerms)
      newErrors.agreeToTerms = 'You must agree to terms & conditions.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(firstName, lastName, email, password, confirmPassword);
      toast.success('Welcome to BuddyScript!');
      navigate('/feed');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        // Laravel validation errors
        const apiErrors = {};
        Object.entries(data.errors).forEach(([key, msgs]) => {
          apiErrors[key] = msgs[0];
        });
        setErrors(apiErrors);
      } else {
        const msg = data?.message || 'Registration failed. Please try again.';
        toast.error(msg);
        setErrors({ general: msg });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const FieldError = ({ field }) =>
    errors[field] ? (
      <p className={styles.fieldError}>{errors[field]}</p>
    ) : null;

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      {/* Background Shapes */}
      <div className="_shape_one">
        <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape.svg" alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>

      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Image */}
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src="/assets/images/registration.png" alt="Register" />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img src="/assets/images/registration1.png" alt="Register Dark" />
                </div>
              </div>
            </div>

            {/* Register Form */}
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img src="/assets/images/logo.svg" alt="BuddyScript" className="_right_logo" />
                </div>
                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>

                {errors.general && (
                  <div className={styles.errorBanner}>
                    {errors.general}
                  </div>
                )}

                <form className="_social_registration_form" onSubmit={handleSubmit}>
                  <div className="row">
                    {/* First Name */}
                    <div className="col-xl-6">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="reg_first_name">First Name</label>
                        <input
                          id="reg_first_name"
                          type="text"
                          className={`form-control _social_registration_input ${styles.input}`}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="e.g. John"
                          disabled={isLoading}
                        />
                        <FieldError field="first_name" />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="col-xl-6">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="reg_last_name">Last Name</label>
                        <input
                          id="reg_last_name"
                          type="text"
                          className={`form-control _social_registration_input ${styles.input}`}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="e.g. Doe"
                          disabled={isLoading}
                        />
                        <FieldError field="last_name" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-xl-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="reg_email">Email</label>
                        <input
                          id="reg_email"
                          type="email"
                          className={`form-control _social_registration_input ${styles.input}`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          disabled={isLoading}
                        />
                        <FieldError field="email" />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-xl-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="reg_password">Password</label>
                        <p className={styles.fieldHint}>At least 8 characters, 1 uppercase letter, and 1 number.</p>
                        <input
                          id="reg_password"
                          type="password"
                          className={`form-control _social_registration_input ${styles.input}`}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          disabled={isLoading}
                        />
                        <FieldError field="password" />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-xl-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="reg_confirm_password">Repeat Password</label>
                        <input
                          id="reg_confirm_password"
                          type="password"
                          className={`form-control _social_registration_input ${styles.input}`}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          disabled={isLoading}
                        />
                        <FieldError field="confirmPassword" />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-check _social_registration_form_check">
                        <input
                          id="reg_terms"
                          className="form-check-input _social_registration_form_check_input"
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                        />
                        <label className="form-check-label _social_registration_form_check_label" htmlFor="reg_terms">
                          I agree to terms &amp; conditions
                        </label>
                      </div>
                      <FieldError field="agreeToTerms" />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button
                          id="register_submit_btn"
                          type="submit"
                          className={`_social_registration_form_btn_link _btn1 ${styles.submitButton}`}
                          disabled={isLoading}
                        >
                          {isLoading && <span className={`_spinner ${styles.submitSpinner}`} />}
                          {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="row">
                  <div className="col-xl-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account?{' '}
                        <Link to="/login">Login here</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
