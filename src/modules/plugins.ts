// This module provides a function to retrieve information about the plugins installed in the browser.
import { Hashing } from '../utils/hashing';

interface PluginInfo {
	pluginCount: number; // The number of plugins
	pluginHash: string; // The hash of the plugins
	plugins: string[]; // The list of plugins
}

/**
 * Function to get plugin information.
 * @returns An object containing plugin information (count, hash, and list of plugins).
 */
// This interface defines the structure of the object returned by the plugins function
export const plugins = () : PluginInfo => {
	const plugin: string[] = [];
	const length = navigator.plugins.length;
	for (let i = 0; i < length; i++) {
		plugin.push(navigator.plugins[i].name);
	}
	return {
		pluginCount: plugin.length,
		pluginHash: Hashing(JSON.stringify(plugin)),
		plugins: plugin,
	};
};
