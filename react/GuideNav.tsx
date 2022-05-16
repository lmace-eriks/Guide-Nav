import React from 'react';
import { useEffect } from 'react';

// Styles
import styles from "./styles.css";

interface GuideNavProps {
  shopAll?: NavObject,
  navigationType?: String,
  navLinks: Array<NavObject>
}

interface NavObject {
  text: string,
  link?: string,
  subMenu?: Array<NavObject>
}

const GuideNav: StorefrontFunctionComponent<GuideNavProps> = ({ shopAll, navigationType, navLinks }) => {
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
    const clicked = e.target;
    const collapsedMenuHeight: string = "0rem";

    switch (clicked.className) {
      case "eriksbikeshop-guidenav-1-x-subMenuParent": {
        const numberOfChildren: number = clicked.children[1].children.length;
        const openParentMenuHeight: number = numberOfChildren * heightOfLink + heightOfLink;
        const openSubMenuHeight: number = numberOfChildren * heightOfLink;
        const menuIsClosed = clicked.children[1].style.height != `${numberOfChildren * heightOfLink}rem`;

        if (menuIsClosed) closeAllSubMenus();
        clicked.style.height = menuIsClosed ? `${openParentMenuHeight}rem` : `${heightOfLink}rem`;
        clicked.children[1].style.height = menuIsClosed ? `${openSubMenuHeight}rem` : collapsedMenuHeight;
        clicked.firstChild.children[0].innerText = menuIsClosed ? openIcon : closedIcon;
        break;
      }

      case "eriksbikeshop-guidenav-1-x-subMenuText": {
        const numberOfChildren: number = clicked.nextSibling.children.length;
        const openParentMenuHeight: number = numberOfChildren * heightOfLink + heightOfLink;
        const openSubMenuHeight: number = numberOfChildren * heightOfLink;
        const menuIsClosed = clicked.nextSibling.style.height != `${numberOfChildren * heightOfLink}rem`;

        if (menuIsClosed) closeAllSubMenus();
        clicked.parentNode.style.height = menuIsClosed ? `${openParentMenuHeight}rem` : `${heightOfLink}rem`;
        clicked.nextSibling.style.height = menuIsClosed ? `${openSubMenuHeight}rem` : collapsedMenuHeight;
        clicked.firstChild.innerText = menuIsClosed ? openIcon : closedIcon;
        break;
      }

      case "eriksbikeshop-guidenav-1-x-expand": {
        const numberOfChildren: number = clicked.parentNode.nextSibling.children.length;
        const openParentMenuHeight: number = numberOfChildren * heightOfLink + heightOfLink;
        const openSubMenuHeight: number = numberOfChildren * heightOfLink;
        const menuIsClosed = clicked.parentNode.nextSibling.style.height != `${numberOfChildren * heightOfLink}rem`;

        if (menuIsClosed) closeAllSubMenus();
        clicked.parentNode.parentNode.style.height = menuIsClosed ? `${openParentMenuHeight}rem` : `${heightOfLink}rem`;
        clicked.parentNode.nextSibling.style.height = menuIsClosed ? `${openSubMenuHeight}rem` : collapsedMenuHeight;
        clicked.innerText = menuIsClosed ? openIcon : closedIcon;
      }
      default:
        break;
    }
  }

  const disappearHeadroom = () => {
    // Prevents the Head Room app from covering the scrolled to content - LM

    //@ts-expect-error
    const headRoom: any = document.getElementsByClassName("headroom")[0];
    headRoom.style.position = "static";
  }

  const handleNavigationClick = (e: any) => {
    // If clicking outside of a submenu, close all submenus - LM
    if (e.target.parentElement.className === "eriksbikeshop-guidenav-1-x-linkWrapper") closeAllSubMenus();
    disappearHeadroom();
  }

  const vtexTableHack = () => {
    // VTEX will strip out any "colspan" attribute from any tables in rich text.
    // This is an embarrassing workaround.
    // Currently this is only active on the bike sizing page - LM 04/28/2022

    // @ts-expect-error
    const tableHack = document.getElementsByClassName("vtex-ebs-bike-size-th")[0];
    if (tableHack) tableHack.setAttribute("colspan", "2");
  }

  useEffect(() => {
    console.clear();
    vtexTableHack();
  })

  return (
    <nav>
      <div className={styles.pageNavTextContainer}>
        <p className={styles.pageNavText}>{navigationType ? navigationType : "Page"} Navigation</p>
      </div>
      {shopAll &&
        <div className={styles.shopAllButtonContainer}>
          <a href={shopAll.link} className={styles.shopAllButton}>Shop All {shopAll.text}</a>
        </div>
      }
      {navigationType &&
        <div className={styles.shopAllButtonContainer}>
          <div className={styles.shopAllButton}>{navigationType} Navigation</div>
        </div>
      }


      {navLinks.map(nav => (
        <div key={nav.text} className={styles.linkContainer}>
          {nav.subMenu &&
            <div className={styles.subMenuContainer}>
              <div onClick={handleSubMenuClick} style={{ height: `${heightOfLink}rem` }} className={styles.subMenuParent}>
                <div style={{ height: `${heightOfLink}rem` }} className={styles.subMenuText}><span className={styles.expand}>▶</span> {nav.text}</div>
                <div className={styles.subMenuWrapper}>
                  {nav.subMenu.map(sub => (
                    <div key={sub.text} style={{ height: `${heightOfLink}rem` }} className={styles.subMenuLinkContainer}>
                      <a onClick={handleNavigationClick} href={sub.link} className={styles.subMenuLink}>- {sub.text}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
          {nav.link &&
            <div style={{ height: `${heightOfLink}rem` }} className={styles.linkWrapper}>
              <a onClick={handleNavigationClick} href={nav.link} className={styles.link}>- {nav.text}</a>
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
