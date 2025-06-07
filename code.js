// ------------------------------------------------------------------
//                       EXPORT STEMS EXTENDED
// ------------------------------------------------------------------
// This script adds a missing feature to PreSonus Studio One (c) by 
// temporarily adding numerical prefixes to channel names during stem
// export, preserving the song’s channel order in the exported files. 
// 
// This also maintains the correct track order when importing stems 
// into other audio workstations. The prefixes are automatically 
// removed after the stem export, leaving the session unchanged.
//
// Created by: Gray Wolf 
// ------------------------------------------------------------------ 

function exportStemsPlus()
{
	this.interfaces =  [Host.Interfaces.IEditTask]

	// get the main channel list
	let channels = Host.Objects.getObjectByUrl
	("object://hostapp/Studio/ActiveEnvironment/MixerConsole")
	.getChannelList (1)

	// --------------------------------------

	this.prepareEdit = function (context)
	{
		return Host.Results.kResultOk;
	}

	// --------------------------------------

	this.performEdit = function (context)
	{
		// prefix the mixer channel names
		this.prefixMixerChannels();

		// open the Export Stems dialog which will 
		// also pause the script until it closes
		Host.GUI.Commands.interpretCommand("Song","Export Stems")

		// remove the channel prefixes
		this.removeChannelPrefixes();

		return Host.Results.kResultOk;
	}

	// -------------------------------------- 

	this.prefixMixerChannels = function ()
	{
		// iterate the channel list
		for (i=0; i < channels.numChannels; i++ )
		{
			// get the current channel
			let channel = channels.getChannel(i);
	
			// ignore the Chord Track channel
			// and any MusicTrack channels
			if (channel.label == "Chord Track" || 
				channel.channelType == "MusicTrack")
				continue;
       
			// numerically prefix the channel name
			let prefix = (i).toString().padStart(3, '0');
			let newName = prefix + "-" + channel.label.trim();
			channel.label = newName;
		}
	}

	// -------------------------------------- 

	this.removeChannelPrefixes = function ()
	{
		// iterate the channel list
		for (i=0; i < channels.numChannels; i++ )
		{
			// get the current channel
			let channel = channels.getChannel(i)

			// only rename if the 4th char is -
			// to avoid any potential error
			if(channel.label[3] == "-")
			{
				let name = channel.label;
				channel.label = name.slice(4);
			}
		}
	}
}

// ------------------------------------------

function createInstance()
{
	return new exportStemsPlus();
}
