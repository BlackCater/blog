import React, { Component } from "react"
import { Helmet } from "react-helmet"
import { Icon } from "components"
import { query as q, events, style } from "dom-helpers"
import { throttle } from "lodash"
import cx from "classnames"

import "./index.styl"

export default class IndexLayout extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menu: false,
      transparent: true,
      cover: "",
      title: "",
    }
  }

  componentDidMount() {
    events.on(window.document, "wheel", this.handleWheel)
  }

  componentWillUnmount() {
    events.off(window.document, "wheel", this.handleWheel)
  }

  // 切换 菜单栏显隐
  toggleMenu = menu => {
    this.setState({
      menu: !menu,
    })
  }

  handleWheel = throttle(e => {
    const { deltaY } = e
    const scrollTop = q.scrollTop(window.document)

    if (deltaY === 0) return

    if (!scrollTop && deltaY > 10) {
      this.setState({
        transparent: false,
      })
    }

    if (!scrollTop && deltaY < -10) {
      this.setState({
        transparent: true,
      })
    }
  }, 300)

  // 动画开始
  handleCoverTransitionStart = () => {
    console.log("start")

    style(window.document.body, "overflow", "hidden")
  }

  // 封面动画完毕
  handleCoverTransitionEnd = () => {
    const { transparent } = this.state

    console.dir("end")

    if (!transparent) {
      style(window.document.body, "overflow", "auto")
    }
  }

  // 滚动
  handleMoveDown = () => {
    this.setState({
      transparent: false,
    })
  }

  setCover = cover => {
    this.setState({
      cover,
    })
  }

  setTitle = title => {
    this.setState({
      title,
    })
  }

  render() {
    const { menu, transparent } = this.state
    const { children, data: { site: { siteMetadata: metaData } } } = this.props
    const { title, description, nickname, slogan, socials, links } = metaData

    return (
      <div className="layout" ref={ele => (this.layout = ele)}>
        <Helmet>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="description" content={description} />
          <link href="/favicon.png" rel="shortcut icon" type="image/x-icon" />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700"
            rel="stylesheet"
          />
          <link href="/favicon.png" rel="apple-touch-icon-precomposed" />
        </Helmet>
        <div
          className={cx({
            "layout-header": true,
            transparent,
          })}>
          <div className="title-section">
            <img
              className="avatar"
              src={require("images/avatar.png")}
              alt={nickname}
            />
            <div id="title" className="title">
              {this.state.title || title}
            </div>
            <div className="icon" onClick={() => this.toggleMenu(menu)}>
              <Icon
                type={menu ? "x" : "menu"}
                style={{
                  color: transparent ? "#ffffff" : "#758db0",
                  fontSize: "20px",
                }}
              />
            </div>
          </div>
          <div
            className={cx({
              "menu-list": true,
              active: menu,
            })}
            onScroll={e => {
              console.log("haha")

              e.preventDefault()
              e.stopPropagation()
            }}>
            <div className="menu-item">HOME</div>
            <div className="menu-item">TAG</div>
            <div className="menu-item">ARCHIVE</div>
            <div className="menu-item">RESUME</div>
            <div className="menu-item">ABOUT</div>
          </div>
        </div>
        <div className="layout-content">
          <div
            style={{
              transform: transparent
                ? "translate(0 ,0)"
                : "translate(0, -100%)",
              animationName: transparent
                ? "CoverSlideDownAnimation"
                : "CoverSlideUpAnimation",
            }}
            className="section section-cover"
            onAnimationStart={this.handleCoverTransitionStart}
            onAnimationEnd={this.handleCoverTransitionEnd}>
            <div
              style={{
                background: `url("${this.state.cover}") 50% 50% / cover`,
              }}
              className="fullscreen"
            />
            <div className="fullscreen-by">
              PROVIDED BY{" "}
              <a href="https://unsplash.com" target="_blank">
                Unsplash
              </a>
            </div>
            <div className="more-btn" onClick={this.handleMoveDown}>
              <Icon
                type="arrow-down"
                style={{ color: "#fff", fontSize: "20px" }}
              />
            </div>
          </div>
          <div className="section section-content">
            {children({
              ...this.props,
              setCover: this.setCover,
              setTitle: this.setTitle,
            })}
          </div>
        </div>
        <div className="layout-footer">
          <div className="section">
            <div className="left">
              <div className="slogan">
                <div className="title">SLOGAN</div>
                <p>{slogan}</p>
              </div>
              <div className="social-list">
                {socials.map(social => (
                  <div key={social.type} className="social-item">
                    <a href={social.url} target="_blank">
                      <img
                        style={{ width: "14px", height: "14px" }}
                        src={require(`images/links/${social.type}.png`)}
                        alt={social.type}
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="right">
              {links.length > 0 ? (
                <div className="section-list">
                  <div className="title">LINKS</div>
                  <div className="link-list">
                    {links.map(link => (
                      <div key={link.name} className="link-item">
                        <a href={link.link} target="_blank">
                          {link.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="info">
            <div className="right">
              {nickname.toUpperCase()} &copy; ALL RIGHT RESERVED.
            </div>
            <div className="tool">POWERED BY GATSBY</div>
          </div>
        </div>
      </div>
    )
  }
}

export const query = graphql`
  query LayoutData {
    site {
      siteMetadata {
        title
        description
        nickname
        slogan
        email
        socials {
          type
          url
        }
        links {
          name
          link
        }
      }
    }
  }
`
