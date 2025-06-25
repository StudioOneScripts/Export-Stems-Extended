// ------------------------------------------------------------------
//                       EXPORT STEMS EXTENDED
// ------------------------------------------------------------------
// This script temporarily adds numerical prefixes to channel names 
// during stem export, preserving the song’s channel order on the 
// computer file system. This also maintains the correct track order 
// when importing stems into other audio workstations. 
// 
// The prefixes are automatically removed after the stem export, 
// leaving the session unchanged.
//
// ------------------------------------------------------------------ 

function exportStemsPlus()
{
	this.interfaces = [Host.Interfaces.IEditTask]

	// get the main channel list
	let channels = Host.Objects.getObjectByUrl
	("object://hostapp/Studio/ActiveEnvironment/MixerConsole")
	.getChannelList(1)

	// --------------------------------------

	this.prepareEdit = function (context)
	{
		return Host.Results.kResultOk;
	}

	// --------------------------------------

	this.performEdit = function (context)
	{		
		// prefix the channel names
		this.prefixMixerChannels();

		// open the stems dialog
		Host.GUI.Commands.interpretCommand("Song","Export Stems")

		// remove the channel prefixes 
		this.removeChannelPrefixes();

		return Host.Results.kResultOk;
	}

	// -------------------------------------- 

	this.prefixMixerChannels = function ()
	{
		for (i=0; i < channels.numChannels; i++ )
		{
			let channel = channels.getChannel(i);

			if (channel.channelType == "MusicTrack")
				continue;

			let prefix = i.toString().padStart(3, '0');
			channel.label = prefix + "-" + channel.label.trim();
		}
	}

	// -------------------------------------- 

	this.removeChannelPrefixes = function ()
	{
		for (i=0; i < channels.numChannels; i++ )
		{
			let channel = channels.getChannel(i)

			if (channel.channelType == "MusicTrack")
				continue;

			// only rename if the 4th char is
			// - to avoid any possible error
			if(channel.label[3] == "-")
			{
				// remove the first 4 chars
				channel.label = channel.label.slice(4);
			}
		}
	}
}

// ------------------------------------------

function createInstance()
{
	return new exportStemsPlus();
}
