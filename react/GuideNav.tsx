import { mathMod } from 'ramda';
import React from 'react';
import { useState, useEffect, useRef, CSSProperties } from 'react';

// Styles
import styles from "./styles.css";

interface GuideNavProps {
  shopAll: NavObject
  navLinks: Array<NavObject>
}

interface NavObject {
  text: string,
  link?: string
  subMenu?: Array<NavObject>
}

const GuideNav: StorefrontFunctionComponent<GuideNavProps> = ({ shopAll, navLinks }) => {
  const heightOfLink: number = 2;
  const closedIcon: string = "▶"
  const openIcon: string = "▼"

  const closeAllSubMenus = () => {
    // @ts-expect-error
    const subMenuParents: Array<any> = document.getElementsByClassName("eriksbikeshop-guidenav-1-x-subMenuParent");
    // @ts-expect-error
    const subMenuWrappers: Array<any> = document.getElementsByClassName("eriksbikeshop-guidenav-1-x-subMenuWrapper");
    // @ts-expect-error
    const allArrows: Array<any> = document.getElementsByClassName("eriksbikeshop-guidenav-1-x-expand");

    for (let i = 0; i < subMenuParents.length; i++) {
      subMenuParents[i].style.height = `${heightOfLink}rem`
      subMenuWrappers[i].style.height = "0rem";
      allArrows[i].innerText = closedIcon;
    }
  }

  const handleSubMenuClick = (e: any) => {
    if (e.target.className === "eriksbikeshop-guidenav-1-x-subMenuParent") {
      const numberOfChildren: number = e.target.children[1].children.length;
      if (e.target.children[1].style.height != `${numberOfChildren * heightOfLink}rem`) {
        closeAllSubMenus();
        e.target.children[1].style.height = `${numberOfChildren * heightOfLink}rem`;
        e.target.style.height = `${numberOfChildren * heightOfLink + heightOfLink}rem`;
        e.target.firstChild.children[0].innerText = openIcon;
      } else {
        e.target.children[1].style.height = "0rem";
        e.target.style.height = `${heightOfLink}rem`;
        e.target.firstChild.children[0].innerText = closedIcon;
      }
    }
    if (e.target.className === "eriksbikeshop-guidenav-1-x-subMenuText") {
      const numberOfChildren: number = e.target.nextSibling.children.length;
      if (e.target.nextSibling.style.height != `${numberOfChildren * heightOfLink}rem`) {
        closeAllSubMenus();
        e.target.nextSibling.style.height = `${numberOfChildren * heightOfLink}rem`;
        e.target.parentNode.style.height = `${numberOfChildren * heightOfLink + heightOfLink}rem`;
        e.target.firstChild.innerText = openIcon;
      } else {
        e.target.nextSibling.style.height = "0rem";
        e.target.parentNode.style.height = `${heightOfLink}rem`;
        e.target.firstChild.innerText = closedIcon;
      }
    }
    if (e.target.className === "eriksbikeshop-guidenav-1-x-expand") {
      const numberOfChildren: number = e.target.parentNode.nextSibling.children.length;
      if (e.target.parentNode.nextSibling.style.height != `${numberOfChildren * heightOfLink}rem`) {
        closeAllSubMenus();
        e.target.parentNode.nextSibling.style.height = `${numberOfChildren * heightOfLink}rem`;
        e.target.parentNode.parentNode.style.height = `${numberOfChildren * heightOfLink + heightOfLink}rem`;
        e.target.innerText = openIcon;
      } else {
        e.target.parentNode.nextSibling.style.height = "0rem";
        e.target.parentNode.parentNode.style.height = `${heightOfLink}rem`;
        e.target.innerText = closedIcon;
      }
    }
  }

  useEffect(() => {
    console.clear();
  })

  return (
    <nav>
      <div className={styles.pageNavTextContainer}>
        <p className={styles.pageNavText}>Page Navigation</p>
      </div>
      <div className={styles.shopAllButtonContainer}>
        <a href={shopAll.link} className={styles.shopAllButton}>Shop All {shopAll.text}</a>
      </div>
      {navLinks.map(nav => (
        <div key={nav.text} className={styles.linkContainer}>
          {nav.subMenu &&
            <div className={styles.subMenuContainer}>
              <div onClick={handleSubMenuClick} style={{ height: `${heightOfLink}rem` }} className={styles.subMenuParent}>
                <div style={{ height: `${heightOfLink}rem` }} className={styles.subMenuText}><span className={styles.expand}>▶</span> {nav.text}</div>
                <div className={styles.subMenuWrapper}>
                  {nav.subMenu.map(sub => (
                    <div key={sub.text} style={{ height: `${heightOfLink}rem` }} className={styles.subMenuLinkContainer}>
                      <a href={sub.link} className={styles.subMenuLink}>- {sub.text}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
          {nav.link &&
            <div style={{ height: `${heightOfLink}rem` }} className={styles.linkWrapper}>
              <a onClick={closeAllSubMenus} href={nav.link} className={styles.link}>- {nav.text}</a>
            </div>
          }
        </div>
      ))}
    </nav>
  )
}

GuideNav.schema = {
  title: 'editor.guidenav.title',
  description: 'editor.guidenav.description',
  type: 'object',
  properties: {}
}

export default GuideNav;
