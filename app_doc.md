# gptOS Developer Documentation

This guide explains how to create applications for gptOS, including how to use the available features and integrate your app into the system.

## Overview of gptOS App Development

Applications in gptOS are modular and written in JavaScript. Each app interacts with the system’s kernel, virtual file system, and window manager. Apps are registered with the kernel, which manages launching, window creation, and system integration.

## Writing a gptOS App

To create an app, write a JavaScript file that registers the app with the kernel and defines its functionality. Use the kernel.registerApp function to give the app a unique ID, a display name, and a function that creates the app’s window.

Include your app’s JavaScript file in index.html using a <script> tag. The script should be added after the kernel script to ensure proper loading.

## Window Management

The createWindow function generates a new application window with a title bar, close button, and resizable functionality. The function returns an object containing the window element and a content container where you can add elements.

##  Kernel Commands

The kernel provides several built-in commands for managing files, directories, and processes:
	•	mkdir creates a new directory.
	•	rmdir removes an empty directory.
	•	touch creates an empty file.
	•	rm deletes a file.
	•	mv moves a file or directory.
	•	cp copies a file or directory.
	•	exit closes the terminal window.
	•	kill terminates a process by its ID.

## File System Utilities

gptOS provides utilities for file operations. Use fsListDir to list the contents of a directory, fsReadFile to read file contents, and fsWriteFile to write or create files. Use fsDeleteFile to delete a file and fsGetNode to retrieve a directory or file node.

## Inter-App Communication

Applications can interact with others by fetching their references from the kernel and invoking their functions. This allows for app integration and enhanced functionality.

## Example Workflow

Write your app in a JavaScript file and register it with the kernel. Use createWindow to set up the app’s interface. Include the script in index.html and test the app by launching it in gptOS.

This documentation explains the key aspects of gptOS app development, enabling you to create functional and integrated applications.

Credits for ChatGPT for documentation.
