import { useState, useEffect, useReducer } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Box, Button, Container, Grid2, Paper, TextField } from "@mui/material";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Container maxWidth="md" sx={{ height: "100vh", display: "grid", alignItems: "center" }}>
            <Paper elevation={6} sx={{ borderRadius: 6 }}>
                <Grid2 container spacing={2} p={2}>
                    <Grid2 size={{ xs: 6 }} sx={{ background: "#F5EFFF", borderRadius: 6 }}>
                        <img src={"/trainee.png"} loading="lazy" />
                    </Grid2>
                    <Grid2
                        size={{ xs: 6 }}
                        p={2}
                        sx={{
                            display: "grid",
                            alignItems: "center"
                        }}
                    >
                        <Template
                            kcContext={kcContext}
                            i18n={i18n}
                            doUseDefaultCss={doUseDefaultCss}
                            classes={classes}
                            displayMessage={!messagesPerField.existsError("username", "password")}
                            headerNode={
                                <Box
                                    sx={{
                                        height: "20%",
                                        width: "50%",
                                        margin: "auto"
                                    }}
                                >
                                    <img
                                        src={
                                            "https://s3-us-west-2.amazonaws.com/eagleagent-orig/uploads%2F1616648326657-b5rbzgmsh2u-b8ed159724318f181410ab0e723b60d6%2FProperty+Plus+Logo+Navy+RGB+PREFERRED.png"
                                        }
                                    />
                                </Box>
                            }
                            //displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
                            infoNode={
                                <div id="kc-registration-container">
                                    <div id="kc-registration">
                                        <span>
                                            {msg("noAccount")}{" "}
                                            <a tabIndex={8} href={url.registrationUrl}>
                                                {msg("doRegister")}
                                            </a>
                                        </span>
                                    </div>
                                </div>
                            }
                            socialProvidersNode={
                                <>
                                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                                        <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                                            <hr />
                                            <h2>{msg("identity-provider-login-label")}</h2>
                                            <ul
                                                className={kcClsx(
                                                    "kcFormSocialAccountListClass",
                                                    social.providers.length > 3 && "kcFormSocialAccountListGridClass"
                                                )}
                                            >
                                                {social.providers.map((...[p, , providers]) => (
                                                    <li key={p.alias}>
                                                        <a
                                                            id={`social-${p.alias}`}
                                                            className={kcClsx(
                                                                "kcFormSocialAccountListButtonClass",
                                                                providers.length > 3 && "kcFormSocialAccountGridItem"
                                                            )}
                                                            type="button"
                                                            href={p.loginUrl}
                                                        >
                                                            {p.iconClasses && (
                                                                <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>
                                                            )}
                                                            <span
                                                                className={clsx(
                                                                    kcClsx("kcFormSocialAccountNameClass"),
                                                                    p.iconClasses && "kc-social-icon-text"
                                                                )}
                                                                dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                                            ></span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            }
                        >
                            <div id="kc-form">
                                <div id="kc-form-wrapper">
                                    {realm.password && (
                                        <form
                                            id="kc-form-login"
                                            onSubmit={() => {
                                                setIsLoginButtonDisabled(true);
                                                return true;
                                            }}
                                            action={url.loginAction}
                                            method="post"
                                        >
                                            {!usernameHidden && (
                                                <div className={kcClsx("kcFormGroupClass")}>
                                                    <TextField
                                                        label={
                                                            <label htmlFor="username" className={kcClsx("kcLabelClass")}>
                                                                {!realm.loginWithEmailAllowed
                                                                    ? msg("username")
                                                                    : !realm.registrationEmailAsUsername
                                                                      ? msg("usernameOrEmail")
                                                                      : msg("email")}
                                                            </label>
                                                        }
                                                        size="small"
                                                        tabIndex={2}
                                                        id="username"
                                                        className={kcClsx("kcInputClass")}
                                                        name="username"
                                                        defaultValue={login.username ?? ""}
                                                        type="text"
                                                        autoFocus
                                                        autoComplete="username"
                                                        aria-invalid={messagesPerField.existsError("username", "password")}
                                                    />
                                                    {messagesPerField.existsError("username", "password") && (
                                                        <span
                                                            id="input-error"
                                                            className={kcClsx("kcInputErrorMessageClass")}
                                                            aria-live="polite"
                                                            dangerouslySetInnerHTML={{
                                                                __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            <div className={kcClsx("kcFormGroupClass")}>
                                                <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password">
                                                    <TextField
                                                        label={
                                                            <label htmlFor="password" className={kcClsx("kcLabelClass")}>
                                                                {msg("password")}
                                                            </label>
                                                        }
                                                        size="small"
                                                        tabIndex={3}
                                                        id="password"
                                                        className={kcClsx("kcInputClass")}
                                                        name="password"
                                                        type="password"
                                                        autoComplete="current-password"
                                                        aria-invalid={messagesPerField.existsError("username", "password")}
                                                    />
                                                </PasswordWrapper>
                                                {usernameHidden && messagesPerField.existsError("username", "password") && (
                                                    <span
                                                        id="input-error"
                                                        className={kcClsx("kcInputErrorMessageClass")}
                                                        aria-live="polite"
                                                        dangerouslySetInnerHTML={{
                                                            __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                        }}
                                                    />
                                                )}
                                            </div>

                                            <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                                                <div id="kc-form-options">
                                                    {realm.rememberMe && !usernameHidden && (
                                                        <div className="checkbox">
                                                            <label>
                                                                <input
                                                                    tabIndex={5}
                                                                    id="rememberMe"
                                                                    name="rememberMe"
                                                                    type="checkbox"
                                                                    defaultChecked={!!login.rememberMe}
                                                                />{" "}
                                                                {msg("rememberMe")}
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={kcClsx("kcFormOptionsWrapperClass")}>
                                                    {realm.resetPasswordAllowed && (
                                                        <span>
                                                            <a tabIndex={6} href={url.loginResetCredentialsUrl}>
                                                                {msg("doForgotPassword")}
                                                            </a>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                                <Button
                                                    tabIndex={7}
                                                    disabled={isLoginButtonDisabled}
                                                    className={
                                                        kcClsx()
                                                        //"kcButtonClass"
                                                        //"kcButtonPrimaryClass"
                                                        // "kcButtonBlockClass",
                                                        // "kcButtonLargeClass"
                                                    }
                                                    name="login"
                                                    id="kc-login"
                                                    type="submit"
                                                    fullWidth
                                                    sx={{
                                                        textTransform: "none",
                                                        fontWeight: "bold",
                                                        color: "white",
                                                        background: "linear-gradient(0deg, rgba(138,67,234,1) 28%, rgba(159,66,233,1) 100%);"
                                                    }}
                                                >
                                                    {msgStr("doLogIn")}
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </Template>
                    </Grid2>
                </Grid2>
            </Paper>
        </Container>
    );
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { kcClsx, i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((isPasswordRevealed: boolean) => !isPasswordRevealed, false);

    useEffect(() => {
        const passwordInputElement = document.getElementById(passwordInputId);

        assert(passwordInputElement instanceof HTMLInputElement);

        passwordInputElement.type = isPasswordRevealed ? "text" : "password";
    }, [isPasswordRevealed]);

    return (
        <div className={kcClsx("kcInputGroup")}>
            {children}
            <button
                type="button"
                className={kcClsx("kcFormPasswordVisibilityButtonClass")}
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                <i className={kcClsx(isPasswordRevealed ? "kcFormPasswordVisibilityIconHide" : "kcFormPasswordVisibilityIconShow")} aria-hidden />
            </button>
        </div>
    );
}
