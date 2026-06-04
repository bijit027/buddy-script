import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required.';
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
      await register(name, email, password, confirmPassword);
      toast.success('Account created! Please log in.');
      navigate('/login');
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
      <p style={{ color: '#e53e3e', fontSize: 12, marginTop: 4 }}>{errors[field]}</p>
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

                {/* Google Sign-up (UI placeholder) */}
                <button type="button" className="_social_registration_content_btn _mar_b40">
                  <img src="/assets/images/google.svg" alt="Google" className="_google_img" />
                  <span>Register with google</span>
                </button>

                <div className="_social_registration_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                {errors.general && (
                  <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#fff5f5', borderRadius: 6, border: '1px solid #fed7d7' }}>
                    {errors.general}
                  </div>
                )}

                <form className="_social_registration_form" onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Name */}
                    <div className="col-xl-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="reg_name">Full Name</label>
                        <input
                          id="reg_name"
                          type="text"
                          className="form-control _social_registration_input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          disabled={isLoading}
                        />
                        <FieldError field="name" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-xl-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="reg_email">Email</label>
                        <input
                          id="reg_email"
                          type="email"
                          className="form-control _social_registration_input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          disabled={isLoading}
                        />
                        <FieldError field="email" />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-xl-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8" htmlFor="reg_password">Password</label>
                        <input
                          id="reg_password"
                          type="password"
                          className="form-control _social_registration_input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 8 chars, 1 uppercase, 1 number"
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
                          className="form-control _social_registration_input"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat your password"
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
                          className="_social_registration_form_btn_link _btn1"
                          disabled={isLoading}
                          style={{ opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                          {isLoading && <span className="_spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />}
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
