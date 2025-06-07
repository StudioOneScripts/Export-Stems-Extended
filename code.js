// ------------------------------------------------------------------
// Export Stems Extended
//
// This script adds a missing feature to PreSonus Studio One (c) by 
// temporarily prefixing channel names during stem export, preserving
// the song’s track order in the exported files. The prefixes maintain 
// correct track order when importing into other DAWs as well, and are 
// automatically removed after the export to leave the session unchanged.
//
// Created by: Lawrence F.
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
		// prefix the mixer channels
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
			// get the next mixer channel
			let channel = channels.getChannel(i);
	
			// skip the hidden chord track channel
			// and also skip MusicTrack channels
			if (channel.label == "Chord Track" || 
				channel.channelType == "MusicTrack")
				continue;
       
			// prefix the channel name
			let prefix = (i).toString().padStart(3, '0');
			let newName = prefix + "-" + channel.label;
			channel.label = newName;

			Host.Console.writeLine(channel.label)
		}
	}

	this.removeChannelPrefixes = function ()
	{
		// iterate the channel listg
		for (i=0; i < channels.numChannels; i++ )
		{
			// get the next channel
			let channel = channels.getChannel(i)

			// split the label
			var name = channel.label.split('-');

			// rename the channel with the array item
			// while trimming away any leftover spaces
			channel.label = name[name.length-1].trim();
		}
	}
}

// ---------------------------------------------------------------------

function createInstance()
{
	return new exportStemsPlus();
}
