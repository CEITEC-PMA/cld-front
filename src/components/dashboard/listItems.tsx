"use client";
import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useRouter } from "next/navigation";
import Icon from "@mui/material/Icon";
import Link from "next/link";
interface IListItemsProps {
  label: string;
  to: string;
  icon: any;
  isActive: boolean;
}

export default function ListItems({
  label,
  to,
  icon,
  isActive,
}: IListItemsProps) {
  return (
    <Link href={to} passHref style={{ textDecoration: "none", color: "black" }}>
      <ListItemButton
        color="black"
        style={{
          textDecoration: "none",
          backgroundColor: isActive ? "#ccc" : "",
          borderRight: isActive ? "3px solid #0F4C81" : "",
          transition: "border-right 0.3s, background-color 0.3s",
        }}
      >
        <ListItemIcon>
          <Icon>{icon}</Icon>
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </Link>
  );
}
